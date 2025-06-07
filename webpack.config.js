const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'; // Определяем, находимся ли мы в production режиме

  return {
    entry: './src/index.js', 

    
    mode: isProd ? 'production' : 'development',

    output: {
      filename: isProd ? 'main.[contenthash].js' : 'main.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
    },

    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({}),
        new CssMinimizerPlugin({}),
      ],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]'
          }
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
        minify: isProd ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyJS: true,
          minifyCSS: true,
        } : false,
      }),
      
      new MiniCssExtractPlugin({
        filename: isProd ? 'styles/[name].[contenthash].css' : 'styles/[name].css',
      }),
    ],

    devServer: {
      static: {
            directory: path.resolve(__dirname, 'dist'),
  },
  compress: true,
  port: 8080,
  open: true,
},

devtool: isProd ? false : 'eval-source-map',
};
};