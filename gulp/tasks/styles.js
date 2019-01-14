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
const postcssBanner = require('postcss-banner');

const paths = {
  includePaths: Array.prototype.concat(require('node-normalize-scss').includePaths),
  src: [
    `${config.src}/styles/style.scss`,
    `${config.src}/styles/style-editor.scss`,
  ],
  lint: [
    `./${config.src}/styles/**/*.scss`,
  ],
  out: `${config.dist}/`,
};

const lintTransforms = [
  stylelint(),
  reporter({
    clearMessages: true,
    throwError: true,
  }),
];

transforms.push(postcssBanner({ banner: `
	Theme Name: Benenson
	Theme URI: https://benenson.co
	Description: Named after the founder of the human rights group, Amnesty International, Benenson is an open-source WordPress theme built using Gutenberg
	Version: 1.0.3
  Requires at least: WordPress 4.9.8
	Author: Big Bite Creative
	Author URI: https://bigbitecreative.com
	Text Domain: benenson
  Domain Path: /languages
  License: GNU General Public License v3
  License URI: LICENSE
  Tags: theme-options, rtl-language-support, translation-ready, accessibility-ready, featured-images, full-width-template, custom-menu, blog, education, news
` }));

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
