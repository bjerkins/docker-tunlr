var fs = require('fs');
var shell = require('shelljs');

let _sessions = [];
const services = JSON.parse(fs.readFileSync('./config/services.json', 'utf8'));

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
        const command = `ssh ${config.debug ? '-vv' : ''} -o StrictHostKeyChecking=no -N ${config.host} -L *:${config.portLocal}:${config.host}:${config.portRemote}`;

        session = shell.exec(command, { async: true });
        _sessions.push(Object.assign(session, { name: name }));
        console.log('service connected!');
    },

    disconnect: (name) => {
        const session = _getServiceByName(name);

        if (!session) {
            return;
        }

        shell.exec(`kill ${session.pid}`);

        const indexToRemove = _sessions.findIndex(session => session.name === name);
        _sessions.splice(indexToRemove, 1);
    }
});

module.exports = Tunlr;
