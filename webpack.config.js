// This file allows us to serve a development version of our JavaScript via a local server
//and to create a bundled version of our app for production.

const path = require('path');
const webpack = require('webpack');

const port = process.env.PORT || '8080';

const config = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './renderer.js')
  ],
  target: 'electron-renderer',
  output: {
    filename: 'renderer.bundle.js',
    path: __dirname + '/bundle',
    publicPath: `http://localhost:${port}/bundle/`,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'renderer.js')
        ],
        exclude: /node_modules/,
        query: {
          presets: ['@babel/preset-react'],
          plugins: ["transform-class-properties"]
        }
      },
      {
        test: /\.s(a|c)ss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
  ]
};

module.exports = config;
