/*
 * @Author: Rainy
 * @Date: 2020-06-05 20:43:25
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 11:01:44
 */

class Chunk {
  constructor(name) {
    this.name = name;
    this.files = [];
    this.module = {};
    this.entryModule = undefined;
  }
}

module.exports = Chunk;
