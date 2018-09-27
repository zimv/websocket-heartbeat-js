
const path = require('path');
const config = {
    entry: {
        index: './lib/index.js'
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true
    }
}
module.exports = config;