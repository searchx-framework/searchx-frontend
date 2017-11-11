var postcssImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var simpleVars = require('postcss-simple-vars');
var postcssNested = require('postcss-nested');
var webpack = require('webpack');
var path = require('path');

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
        host: "0.0.0.0"
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
            { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=10000' }
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
        'config': JSON.stringify(process.env.ENV === 'production' ? {
            serverUrl: "https://searchx.ewi.tudelft.nl:443",
            logTimeInterval: 5000
        } : {
            serverUrl: "https://52.58.223.73:4443",
            logTimeInterval: 5000,
            redirectSearchBox: {
                "SBD101X": "https://edge.edx.org/courses/course-v1:DelftX+SBD101X+2017_T2/aa17b838d481463489e6d2f16c99b2b4/",
                "CTB3365STx" : "https://courses.edx.org/courses/course-v1:DelftX+CTB3365STx+2T2017/78875677c8024e068cb9fddd2e6a60f1/",
                "CTB3365DWx" : "https://courses.edx.org/courses/course-v1:DelftX+CTB3365DWx+2T2017/21a8fdb4f03d468e8c01e71e8b48f621/"
            }
        })
    }
};
