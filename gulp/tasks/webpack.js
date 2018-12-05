const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.config.js');

module.exports = () => {
  /**
   * Production builds.
   */
  gulp.task('webpack:build', (callback) => {
    // Run webpack.
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        throw new gutil.PluginError('webpack:build', err);
      }

      gutil.log('[webpack:build]', stats.toString({
        colors: true,
      }));

      callback();
    });
  });


  /**
   * Development builds.
   */
  gulp.task('webpack:build-dev', (callback) => {
    // Create a single instance of the compiler to allow caching.
    const devCompiler = webpack(webpackConfig);

    // Run webpack.
    devCompiler.run((err, stats) => {
      if (err) {
        throw new gutil.PluginError('webpack:build-dev', err);
      }

      gutil.log('[webpack:build-dev]', stats.toString({
        colors: true,
      }));

      callback();
    });
  });
};
