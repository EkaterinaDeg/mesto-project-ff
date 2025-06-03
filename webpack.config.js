const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',

  output: {
    filename: 'bundle.js',
        publicPath: './',
    path: path.resolve(__dirname, 'dist'),
    clean: true, 
    assetModuleFilename: 'assets/[name].[hash][ext]',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, {                 
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader'
        ]
      },
    ] 
  },
  
  resolve: {
    fallback: {
      "path": false, // или require.resolve("path-browserify")
      "fs": false,   // В браузере нет доступа к файловой системе
      "os": false,   // или require.resolve("os-browserify/browser")
      "url": false   // или require.resolve("url")
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],

  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
  },

  devtool: 'source-map',
};
