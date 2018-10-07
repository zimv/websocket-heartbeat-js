
const path = require('path');
const config = {
    entry: {
        index: './lib/index.js'
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    optimization: {
        minimize: true
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/, 
                loader: "babel-loader"
            }
        ]
    },
    mode: "production"
}
module.exports = config;