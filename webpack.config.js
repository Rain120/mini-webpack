const path = require('path');

module.exports = {
    mode: 'development',
    entry: './example/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist'),
    }
}