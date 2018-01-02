const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const simpleVars = require('postcss-simple-vars');
const postcssNested = require('postcss-nested');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./src/js/main.js",

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
        publicPath: '/'
    },

    devServer: {
        inline: true,
        contentBase: './dist',
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        port : 8080,
        host: "127.0.0.1"
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'url-loader?limit=10000'
            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [
                    postcssImport({ addDependencyTo: webpack}),
                    simpleVars, postcssNested, autoprefixer
                ]
            }
        }
    )],

    externals: {
        'env': JSON.stringify(process.env.ENV === 'production' ? {
            serverUrl: "http://127.0.0.1:4443"
        } : {
            serverUrl: "http://127.0.0.1:4443"
        })
    }
};
