const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/client/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.(sass|scss)$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]},
  plugins: [],
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};
