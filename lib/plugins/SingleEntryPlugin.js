/*
 * @Author: Rainy
 * @Date: 2020-06-07 11:00:58
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-13 18:45:18
 */

/**
 * @description single file entry
 */
class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context;
    this.entry = entry;
    this.name = name;
  }
  apply(compiler) {
    console.log(Date.now(), 'SingleEntryPlugin tap make hooks');
    compiler.hooks.make.tapAsync(
      'SingleEntryPlugin',
      (compilation, callback) => {
        const { context, entry, name } = this;
        compilation.addEntry(context, entry, name, callback);
      }
    );
  }
}

module.exports = SingleEntryPlugin;
