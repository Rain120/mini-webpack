/*
 * @Author: Rainy
 * @Date: 2020-06-07 10:10:19
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 17:44:22
 */

const fs = require('fs');
const memoryFs = require('../MemoryOutputFileSystem');

/**
 * @description
 * define the input/output file system,
 * webpack had achieved the cache inputFilesystem by self.
 */
// LINK_TO: https://github.com/webpack/webpack/blob/d573a12a6c/lib/node/NodeEnvironmentPlugin.js
class NodeEnvironmentPlugin {
  constructor(options) {
    this.options = options || {};
  }
  apply(compiler) {
    // INFO: webpack used the pkg with enhanced-resolve/lib/CachedInputFileSystem for inputFileSystem
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs;

    // INFO: tap beforeRun hook
    compiler.hooks.beforeRun.tap('NodeEnvironmentPlugin', compiler => {
      console.log(Date.now(), 'NodeEnvironmentPlugin tap beforeRun hook');
    });
  }
}

module.exports = NodeEnvironmentPlugin;
