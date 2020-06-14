/*
 * @Author: Rainy
 * @Date: 2020-06-06 17:25:45
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-13 18:46:36
 */

const SingleEntryPlugin = require('./SingleEntryPlugin');

const itemToPlugin = (context, entry, name) => {
  if (Array.isArray(entry)) {
    // TODO: Multiple entries
  } else {
    return new SingleEntryPlugin(context, entry, 'main');
  }
}

/**
 * @description multiple files entry
 */
// LINK_TO: https://webpack.js.org/concepts/entry-points/
class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      console.log(Date.now(), 'EntryOptionPlugin tap EntryOptionPlugin hook');
      if (typeof entry === 'string') {
        itemToPlugin(context, entry, 'main').apply(compiler);
      } else {
        for (const name of Object.keys(entry)) {
          itemToPlugin(context, entry, name).apply(compiler);
        }
      }
    });
  }
}

module.exports = EntryOptionPlugin;
