/// <reference path="../../lib/typings/colors.d.ts" />
/// <reference path="../../lib/typings/nodePackages.d.ts" />

//fixture site default port 18000
import program = require("commander");

require("colors");

program
  .version('0.1.0')
  .option('-p, --port <n>', 'Fixture Site Listen Port, default port is 18000', parseInt)
  .parse(process.argv);


interface Cli {
    port: number;
}
var cli: Cli = <any>program;

if (!cli.port) {
    cli.port = 18000;//default port
}

import appMod = require("./site/fixturesite");

new appMod.FixtureSite(cli.port);
