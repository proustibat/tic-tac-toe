const path                  = require( 'path' );
const HtmlWebpackPlugin     = require( 'html-webpack-plugin' );
const CleanWebpackPlugin    = require( 'clean-webpack-plugin' );

module.exports = {
    entry: [
        './src/js/main.js',
        './src/index.html'
    ],
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve( __dirname, 'dist' ),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    'raw-loader'
                ]
            },
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
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loaders: ['eslint-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            hash: true,
        }),
        new CleanWebpackPlugin( [ 'dist' ] ),
    ],
};
