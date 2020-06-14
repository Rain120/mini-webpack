/*
 * @Author: Rainy
 * @Date: 2020-06-07 10:07:14
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 15:31:15
 */

const NodeEnvironmentPlugin = require('./plugins/NodeEnvironmentPlugin');
const Compiler = require('./Compiler');
const WebpackOptionApply = require('./WebpackOptionApply');
const version = require("../package.json").version;

const creatCompiler = (options, callback) => {
  console.log(Date.now(), 'webpack creatCompiler');
  const compiler = new Compiler(options.context);

  new NodeEnvironmentPlugin().apply(compiler);

  compiler.options = options;
  const { plugins } = options;

  // LINK_TO: https://github.com/webpack/webpack/blob/d573a12a6c86182405e4e700d6ecbbf0700e4152/lib/webpack.js#L65
  // INFO: apply plugins
  if (plugins && Array.isArray(plugins)) {
    for (const plugin of plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }

  // INFO: call environment & afterEnvironment hooks
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();

  // initialize compiler options with entryOption
  new WebpackOptionApply().process(options, compiler);

  if (callback) {
    compiler.run(callback);
  }

  // INFO: call initialize hook
  compiler.hooks.initialize.call();

  return compiler;
}

const webpack = (options, callback) => {
  const compiler = creatCompiler(options, callback);

  return compiler;
}

exports.version = version;
exports = module.exports = webpack;
