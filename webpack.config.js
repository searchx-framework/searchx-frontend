const webpack = require('webpack');
const path = require('path');

const postcssImport = require('postcss-import');
const postcssAutoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');
const postcssSimpleVars = require('postcss-simple-vars');

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
                test:   /\.(css|pcss)$/,
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
                    postcssImport({addDependencyTo: webpack}),
                    postcssAutoprefixer,
                    postcssNested,
                    postcssSimpleVars,
                ]
            }
        }
    )],

    externals: {
        'env': JSON.stringify(process.env.ENV === 'production' ? {
            serverUrl: "http://csal.ewi.tudelft.nl:4443"
        } : {
            serverUrl: "http://127.0.0.1:4443"
        })
    }
};
