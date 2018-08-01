const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public', 'build');
const APP_DIR = path.resolve(__dirname, 'resources', 'assets');

const config = {
  mode: 'development',
  entry: ['babel-polyfill', APP_DIR + '/index.jsx'],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.dev.js'
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      exclude: /node_modules/,
      include : APP_DIR,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

module.exports = config;
