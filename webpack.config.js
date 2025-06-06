const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.js',
    mode: isProd ? 'production' : 'development',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
      assetModuleFilename: 'assets/[name].[hash][ext]',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/project.html',
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin(),
            new CleanWebpackPlugin(),
          ]
        : []),
    ],
    resolve: {
      fallback: {
        "path": false,
        "fs": false,
        "os": false,
        "url": false,
      },
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      compress: true,
      port: 8080,
      open: true,
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
};
