const vorpal = require('vorpal')();
const tunlr = require('./lib/tunlr.js')();

const startupCommands = process.argv.slice(2);

vorpal
    .command('connect', 'Connect to a service via SSH')
    .action(function (args, callback) {
        const choices = tunlr.getAvailableServices();
        this.prompt({
            type: 'list',
            name: 'service',
            message: 'Choose a service:',
            choices: choices,
        }, result => {
            tunlr.connect(result.service);
            callback();
        });
    });

vorpal
    .command('disconnect', 'Disconnect from a service.')
    .action(function (args, callback) {
        const choices = tunlr.getAvailableServices();
        this.prompt({
            type: 'list',
            name: 'service',
            message: 'Choose a service:',
            choices: choices,
        }, result => {
            tunlr.disconnect(result.service);
            callback();
        });
    });

startupCommands
    .reduce((prev, cur) => prev.then(() => vorpal.exec(cur)), Promise.resolve())
    .then(() => {
        vorpal
            .delimiter(`tunlr $`)
            .show();
    }).catch((err) => console.error(err));

module.exports = tunlr;
