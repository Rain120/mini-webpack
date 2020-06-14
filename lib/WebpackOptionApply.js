/*
 * @Author: Rainy
 * @Date: 2020-06-07 10:35:54
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 12:08:00
 */

const EntryOptionPlugin = require('./plugins/EntryOptionPlugin');

// LINK_TO: https://github.com/webpack/webpack/blob/d573a12a6c86182405e4e700d6ecbbf0700e4152/lib/WebpackOptionsApply.js#L52
class WebpackOptionApply {
  constructor() {
  }

  process(options, compiler) {
    compiler.name = options.name;
    compiler.outputPath = options.output.path;

    new EntryOptionPlugin().apply(compiler);
    // INFO: Here, we know entry and plugins lifecycle
    // INFO: call entryOption afterPlugins hook
    compiler.hooks.entryOption.call(options.context, options.entry);
    compiler.hooks.afterPlugins.call(compiler);
  }
}

module.exports = WebpackOptionApply;
