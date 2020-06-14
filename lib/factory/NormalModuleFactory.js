/*
 * @Author: Rainy
 * @Date: 2020-06-05 20:25:20
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 11:44:49
 */

const NormalModule = require('./NormalModule');

class NormalModuleFactory {
  constructor() {}

  /**
   *
   * @param {data object} data
   */
  create(data) {
    console.log(Date.now(), 'NormalModuleFactory create');
    return new NormalModule(data);
  }
}

module.exports = NormalModuleFactory;
