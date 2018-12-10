const path = require('path');
const webpack = require('webpack');
const config = require('./gulp/config');
const BBErrorNotify = require('./gulp/utils/BBErrorNotify');

const paths = {
  entry: `${config.src}/scripts/app.js`,
  blocks: `${config.src}/scripts/blocks.js`,
  admin: `${config.src}/scripts/admin.js`,
  out: `${config.dist}/`,
};

const webpackConfig = {
  cache: true,
  context: path.resolve(__dirname, './src'),

  entry: {
    bundle: path.join(__dirname, paths.entry),
    blocks: path.join(__dirname, paths.blocks),
    admin: path.join(__dirname, paths.admin),
    // If using a library/libraries include them in their own vendor bundle. Example below:
    // vendor: [ 'jquery' ]
  },

  output: {
    path: path.join(__dirname, paths.out),
    filename: '[name].js',
  },

  module: {
    rules: [
      // Expose App to window.
      {
        test: /app\.js$/,
        loader: 'expose-loader',
        query: 'App',
      },

      // Run Babel and lint JS
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', { modules: false }],
                ['react'],
                ['stage-0'],
              ],
              plugins: ['babel-plugin-lodash'].map(require.resolve),
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              configFile: '.eslintrc',
              emitError: false,
              emitWarning: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // Global vars for checking dev environment.
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
      __TEST__: JSON.stringify(process.env.NODE_ENV === 'test'),
    }),
  ],
};

// Production/Dev Specific Config
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  webpackConfig.devtool = 'sourcemap';
  webpackConfig.plugins.push(
    // Notify on errors / warnings. Plugin code below.
    new BBErrorNotify()
  );
}

module.exports = webpackConfig;
