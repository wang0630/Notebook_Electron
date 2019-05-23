const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const SRC_DIR = path.join(__dirname, 'src');
const OUTPUT_DIR = path.join(__dirname, 'build');

const htmlPlugin = new HtmlPlugin({
  template: `${SRC_DIR}/index.html`,
});

const miniCssPlugin = new MiniCssExtractPlugin({
  filename: '[name].css'
});

module.exports = {
  watch: ENV === 'development',
  target: 'electron-renderer',
  entry: `${SRC_DIR}/index.js`,
  output: {
    path: OUTPUT_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },

  plugins: [
    htmlPlugin,
    miniCssPlugin
  ],
};
