const path = require('path');
const {
  EntryOptionPlugin,
  AfterPlugins,
  RunPlugin,
  DonePlugin,
} = require('./plugins');

module.exports = {
    mode: 'development',
    entry: './example/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist'),
    },
    plugins: [
      new EntryOptionPlugin(),
      new AfterPlugins(),
      new RunPlugin(),
      new DonePlugin(),
    ]
}
