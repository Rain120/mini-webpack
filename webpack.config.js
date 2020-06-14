const path = require('path');
const UsePlugin = require('./plugins');

module.exports = {
    mode: 'development',
    entry: './example/index.js',
    output: {
      filename: 'bundle-v2.js',
      path: path.resolve('./dist'),
    },
    // module: {
    //   rules: [{
    //     test: /\.css/,
    //     use: [require('./loaders/style-loader')]
    //   }]
    // },
    plugins: [
      new UsePlugin(),
    ]
}
