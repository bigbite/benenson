

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const postcss = require('gulp-postcss');
const filter = require('gulp-filter');
const config = require('../config');
const transforms = require('../common/postcssTransforms');

const paths = {
  src: `${config.src}/static/**`,
  out: `${config.dist}`,
};

module.exports = () => {
  gulp.task('static', () => {
    // Filters
    const cssFilter = filter('**/*.css', { restore: true });

    return gulp.src(paths.src)
      .pipe(plumber())
      .pipe(changed(paths.out))
      .pipe(cssFilter)
      .pipe(postcss(transforms))
      .pipe(cssFilter.restore)
      .pipe(gulp.dest(paths.out));
  });
};
