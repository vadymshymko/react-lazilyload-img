const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.jsx',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ReactjsLazilyLoadImg',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new WebpackBar(),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        use: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
