/*
 * @Author: Rainy
 * @Date: 2020-06-07 16:21:13
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 15:31:07
 */

const webpack = require('./webpack');
const options = require('../webpack.config');

const compiler = webpack(options, (err, stats) => {
  if (err) {
    return err;
  }
  console.log(Date.now(), 'wooow, webpack')
});

// compiler.run((err, stats) => {
//   if (err) {
//     return err;
//   }
//   console.log(Date.now(), 'wooow, webpack')
// });
