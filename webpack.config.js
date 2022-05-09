const webpack = require('webpack');
const path =require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.export = (env, options) =>{
    const isProduction = options.mode === 'production';

    const config = {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, '/dist'),
        },

        module:{
            rules:[
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: ['@babel/preset-env']
                      }
                    }  
                },{
                    test: /\.scss$/,
                    use: [
                        'style-loader', 'css-loader', 'sass-loader'
                    ]
                }

            ]
        }, 

        plugins: [
            new CleanWebpackPlugin(),
        ]
    }

    return config;
}