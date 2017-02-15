'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname + '/frontend/js/',
  entry: {
    app: './index'
  },
  output: {
    path: __dirname + '/public/js/',
    filename: "common.js"
    //filename: "common.[chunkhash].js"
  },

  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },

  watch: false,//NODE_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : null,
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },

  devServer: {
    host: 'localhost', //default
    port: '8080', // default
    hot: true
  }
};

if (NODE_ENV === 'production') {
  module.exports.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          'drop_console': true,
          unsafe: true
        }
      })
  );
}
