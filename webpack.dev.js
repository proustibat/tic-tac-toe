const webpack  = require( 'webpack' );
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge( common, {
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
    },
});
