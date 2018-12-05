const gulp = require('gulp');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create('bigbite');
const config = require('../config');

const browserSyncProxy = process.env.BROWSERSYNC_PROXY;

module.exports = () => {
  gulp.task('browsersync', ['watch'], () => {
    config.isBrowserSync = true;

    const browserSyncConfig = {
      open: gutil.env.open || false,
      notify: gutil.env.notify || false,
    };

    if (browserSyncProxy === undefined || browserSyncProxy === 'false') {
      browserSyncConfig.server = {
        baseDir: config.dist,
      };
    } else {
      browserSyncConfig.proxy = browserSyncProxy;
    }

    return browserSync.init(browserSyncConfig);
  });
};
