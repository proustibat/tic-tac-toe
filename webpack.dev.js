const webpack  = require( 'webpack' );
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge( common, {
    output: {
        sourceMapFilename: '[file].map',
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
        })
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
    },
});