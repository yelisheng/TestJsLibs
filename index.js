//fixture site default port 18000
var program = require('commander');
require('colors');
program.version('0.1.0').option('-p, --port <n>', 'Fixture Site Listen Port, default port is 18000', parseInt).parse(process.argv);
var cli = program;
if (!cli.port) {
  cli.port = 18000; //default port
}
var appMod = require('./site/fixturesite');
new appMod.FixtureSite(cli.port);
