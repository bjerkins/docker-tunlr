var fs = require('fs');
var shell = require('shelljs');

let _sessions = [];
const services = JSON.parse(fs.readFileSync('/root/.ssh/tunlr.json', 'utf8'));

const _getServiceByName = name => {
    return _sessions.find(session => session.name === name.replace(' (connected)', ''));
}

const _getServiceConfiguration = name => {
    return services.find(service => service.name === name);
}

const Tunlr = () => ({

    getAvailableServices: () => {
        return services.map(service => {
            return _getServiceByName(service.name) ? service.name + ' (connected)' : service.name;
        });
    },

    connect: (name) => {
        let session = _getServiceByName(name);

        if (session) {
            console.log('Session already connected. Use `disconnect` to disconnect from it');
            return;
        }

        const config = _getServiceConfiguration(name);
        const command = `autossh -4 -M ${config.id} -o ExitOnForwardFailure=yes -N ${config.host} -L *:${config.portLocal}:localhost:${config.portRemote}`;

        session = shell.exec(command, { async: true });

        _sessions.push(Object.assign(session, { name: name }));
        console.log('service connected!');
    },

    disconnect: (name) => {
        const session = _getServiceByName(name);

        if (!session) {
            return;
        }

        shell.exec(`pkill -P ${session.pid}`)

        const indexToRemove = _sessions.findIndex(session => session.name === name);
        _sessions.splice(indexToRemove, 1);
    }
});

module.exports = Tunlr;
