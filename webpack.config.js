const path = require( 'path' );
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve( __dirname, 'dist' )
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?name=fonts/[name].[ext]'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            hash: true
        }),
        new CleanWebpackPlugin( [ 'dist' ] ),
    ]
};