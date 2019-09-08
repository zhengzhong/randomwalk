'use strict';

const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Resolve directories relative to `__dirname`.
const sourceDirectory = path.resolve(__dirname, 'src');
const outputDirectory = path.resolve(__dirname, 'static/frontend/dist');


module.exports = {
  target: 'web',

  entry: {
    // Website-wide stylesheet and JavaScript.
    common: path.resolve(sourceDirectory, 'common/index.js'),

    // Apps.
    activities: path.resolve(sourceDirectory, 'activities/index.jsx'),
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css', // Use the chunk name instead of its id (`[id].css`).
    }),
    new CleanWebpackPlugin([outputDirectory]),
  ],

  output: {
    path: outputDirectory,
    filename: '[name].bundle.js',
  },

  // See: https://webpack.js.org/plugins/split-chunks-plugin/
  optimization: {
    splitChunks: {
      cacheGroups: {

        // Put all React-related packages in a chunk. This is required by React-based apps.
        spa: {
          test: /[\\/]node_modules[\\/](prop-types|react|react-dom|react-router-dom)[\\/]/,
          name: 'spa',
          chunks: 'all',
          priority: 20,
        },

        // With a lower priority, put all other vendor packages (from `node_modules`) in a chunk.
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
  },
};
