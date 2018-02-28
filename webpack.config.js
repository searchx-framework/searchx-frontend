const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/js/main.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
        publicPath: '/'
    },

    devServer: {
        inline: true,
        contentBase: path.resolve(__dirname, 'dist'),
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        port : 8080,
        host: '127.0.0.1'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015']
                    }
                }
            },
            {
                test:   /\.(css|pcss)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },

    externals: {
        'env': JSON.stringify(process.env.ENV === 'production' ? {
            serverUrl: 'http://csal.ewi.tudelft.nl:4443',
            renderUrl: 'http://csal.ewi.tudelft.nl:3000/render'
        } : {
            serverUrl: 'http://127.0.0.1:4443',
            renderUrl: 'http://127.0.0.1:3000/render'
        })
    }
};
