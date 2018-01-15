const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const FaviconsWebpackPlugin = require( 'favicons-webpack-plugin' );

const pagesList = [
    {
        title: 'Home',
        filename: 'index'
    },
    {
        title: 'Dashboard',
        filename: 'dashboard'
    }
];

const getHtmlWebpackPluginInstances = () => {
    return Object.values( pagesList ).map( page => {
        const pageTitle = `Tic Tac Toe - ${ page.title }`;
        return new HtmlWebpackPlugin( {
            filename: `${ page.filename }.html`,
            template: `./src/${ page.filename }.ejs`,
            title: pageTitle,
            hash: true
        } );
    } );
};

module.exports = {
    entry: [
        'babel-polyfill',
        './src/js/main.js',
        ...Object.values( pagesList ).map( page => `./src/${ page.filename }.ejs` )
    ],
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve( __dirname, 'dist' )
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.(ejs)$/,
                use: [
                    'underscore-template-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?name=fonts/[name].[ext]'
                ]
            },
            {
                enforce: 'pre',
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: [ 'babel-preset-latest' ],
                    cacheDirectory: true
                }
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [ {
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'assets/images/[hash]-[name].[ext]'
                    }
                } ]
            }
        ]
    },
    plugins: [
        new StyleLintPlugin( {
            configFile: '.stylelintrc'
        } ),
        ...getHtmlWebpackPluginInstances(),
        new FaviconsWebpackPlugin( './src/favicon.png' ),
        new CleanWebpackPlugin( [ 'dist' ] )
    ],
    devtool: 'source-map'
};
