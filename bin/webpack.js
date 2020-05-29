#! /usr/bin/env node
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const { Compiler } = require('../lib');

const pkg = require(path.resolve(__dirname, '../webpack.config.js'));
const options = require(path.resolve(__dirname, '../webpack.config.js'));

program
  .version(`Rain120/mini-webpack ${pkg.version}`)
  .usage('<command> [options]');


program
  .description('Welcome Mini Webpack, 🎉🎉🎉')
  .option('-e, --entry, [entry]', 'Compile entry path')
  .option('-o, --output, [output]', 'Compile output path')
  .allowUnknownOption();

program.on('--help', () => {
  console.log(`Run ${chalk.cyan(`pack <command> --help`)} for detailed usage of given command.`)
});

program.parse(process.argv);

new Compiler(options).run();
