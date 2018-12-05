const moduleImporter = require('sass-module-importer');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const scss = require('postcss-scss');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const browserSync = require('browser-sync').get('bigbite');
const transforms = require('../common/postcssTransforms');
const errorHandler = require('../utils/errorHandler');
const config = require('../config');

const paths = {
  includePaths: Array.prototype.concat(require('node-normalize-scss').includePaths),
  src: [
    `${config.src}/styles/app.scss`,
    `${config.src}/styles/gutenberg.scss`,
  ],
  lint: [
    `./${config.src}/styles/**/*.scss`,
  ],
  out: `${config.dist}/styles`,
};

const lintTransforms = [
  stylelint(),
  reporter({
    clearMessages: true,
    throwError: true,
  }),
];

module.exports = () => {
  gulp.task('styles:lint', () => gulp.src(paths.lint)
    .pipe(plumber({ errorHandler }))
    .pipe(postcss(lintTransforms, { syntax: scss })));

  gulp.task('styles', ['styles:lint'], () => gulp.src(paths.src)
    .pipe(plumber({ errorHandler }))
    .pipe(config.ENV === 'dev' ? sourcemaps.init() : gutil.noop())
    .pipe(sass({
      includePaths: paths.includePaths,
      importer: moduleImporter(),
    }).on('error', sass.logError))
    .pipe(postcss(transforms))
    .pipe(config.ENV === 'dev' ? sourcemaps.write('.') : gutil.noop())
    .pipe(gulp.dest(paths.out))
    .pipe(browserSync.stream({ match: '**/*.css' })));
};
