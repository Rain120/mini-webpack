/*
 * @Author: Rainy
 * @Date: 2020-06-10 20:41:11
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-13 13:21:48
 */

class Stats {
  constructor(compilation) {
    this.compilation = compilation;
    this.files = compilation.files;
    this.chunks = compilation.chunks;
    this.modules = compilation.modules;
    this.startTime = undefined;
    this.endTime = undefined;
  }
}

module.exports = Stats
