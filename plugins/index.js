/*
 * @Author: Rainy
 * @Date: 2020-05-31 14:32:37
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 17:54:02
 */

// https://webpack.docschina.org/api/plugins/

class UsePlugin {
  apply(compiler) {

    compiler.hooks.environment.tap('MyPlugin',() => {
      console.log(Date.now(), 'UsePlugin -> environment');
    });

    compiler.hooks.entryOption.call('Plugin', (context, entry) => {
      console.log(Date.now(), 'UsePlugin -> entryOption');
    });

    compiler.hooks.afterPlugins.call('Plugin', compiler => {
      console.log(Date.now(), 'UsePlugin -> afterPlugins');
    });

    compiler.hooks.run.callAsync('Plugin', compiler => {
      console.log(Date.now(), 'UsePlugin -> run');
    });

    compiler.hooks.done.callAsync('Plugin', stats => {
      console.log(Date.now(), 'UsePlugin -> done');
    });
  }
}

module.exports = UsePlugin;
