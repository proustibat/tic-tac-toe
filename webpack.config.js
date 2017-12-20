const path                  = require( 'path' );
const HtmlWebpackPlugin     = require( 'html-webpack-plugin' );
const CleanWebpackPlugin    = require( 'clean-webpack-plugin' );
const webpack               = require( 'webpack' );
const UglifyJSPlugin        = require( 'uglifyjs-webpack-plugin' );

module.exports = {
    entry: './src/js/main.js',
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve( __dirname, 'dist' ),
        sourceMapFilename: '[file].map',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader?sourceMap',
                    'css-loader?sourceMap'
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
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map'
        }),
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
};