
const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');
const DotenvPlugin = require('webpack-dotenv-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const publicPath = path.resolve(__dirname, 'public');
const clientPath = path.resolve(__dirname, 'client');

const sassLoaders = [
  'css-loader?indentedSyntax=css&includePaths[]=' + clientPath,
  'postcss-loader',
  'sass-loader?indentedSyntax=sass&includePaths[]=' + clientPath
];

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry: debug ? [
    './node_modules/webpack-dev-server/client?http://localhost:8080/',
	  './node_modules/webpack/hot/dev-server',
	  './client/js/client.js'
  ] : ['./client/js/client.js'],
  target: "web",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?indentedSyntax=css&includePaths[]=' + clientPath),
      }, 
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      },
    ]
  },
  output: {
    path: publicPath,
    filename: "client.min.js"
  },
  devServer:{
    contentBase: publicPath,
    historyApiFallback: true
  },
  plugins: debug ? [
    new DotenvPlugin({
      sample: './.env',
      path: './.env'
    }),
      new ExtractTextPlugin("app.css"),
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
      new ExtractTextPlugin("app.css"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
          API_HOST: JSON.stringify(process.env.API_HOST),
          API_PORT: JSON.stringify(process.env.API_PORT),
          STORE_URL: JSON.stringify(process.env.STORE_URL || "/assets/thesis-video-data"),
        }
      })
    ],
  node: {
    fs: "empty"
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.sass'],
    root: [publicPath],
  }
};
