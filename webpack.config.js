const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/client/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
        output: {
          comments: false
      }
    })
  ],
  devServer: {
    host: '127.0.0.1'
  }
};
