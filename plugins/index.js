/*
 * @Author: Rainy
 * @Date: 2020-05-31 14:32:37
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-02 19:14:25
 */

// https://webpack.docschina.org/api/plugins/

class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap('Plugin', options => {
      console.log('EntryOptionPlugin');
    });
  }
}

class AfterPlugins {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap('Plugin', options => {
      console.log('AfterPlugins');
    });
  }
}

class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('Plugin', options => {
      console.log('RunPlugin');
    });
  }
}

class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Plugin', options => {
      console.log('DonePlugin');
    });
  }
}


module.exports = {
  EntryOptionPlugin,
  AfterPlugins,
  RunPlugin,
  DonePlugin,
};
