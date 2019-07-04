'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const pkg = require('./package');

const {
  DIST_DIR,
} = process.env;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const webpackConfig = {
    stats: {
      publicPath: true,
      chunks: false,
      modules: false,
      children: false,
      entrypoints: false,
      chunkModules: false,
    },

    devtool: isProduction ? false : 'source-map',

    entry: {
      [pkg.name]: path.resolve('src'),
    },

    output: {
      path: DIST_DIR
        ? path.resolve(DIST_DIR)
        : path.join(__dirname, '..', 'app', 'public'),
      publicPath: 'public',
      filename: '[name].js',
    },

    resolve: {
      extensions: [
        '.js',
        '.jsx',
      ],
    },

    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        }, {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        }, {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        }, {
          test: /\.svg$/,
          loader: 'url-loader',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
  };

  if (!isProduction) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (process.env.npm_config_report) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
};
