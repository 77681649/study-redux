'use strict';

const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV

const config = {
    devtool: 'cheap-module-eval-source-map',

    // 插件
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    entry: [
        'webpack-hot-middleware/client',
        './public/index'
    ],

    // 输出项
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },

    module: {
        // 加载器
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
                include: __dirname
            },
            {
                test: /\.css?$/,
                loaders: ['style', 'css'],
                include: __dirname
            }
        ]
    },

    resolve: {

    }
}

console.log(env);

if (env === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false
            }
        })
    )
}

module.exports = config