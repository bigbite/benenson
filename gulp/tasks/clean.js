const gulp = require('gulp');
const del = require('del');
const config = require('../config');

const paths = [
  `${config.dist}/style.css`,
  `${config.dist}/style-editor.css`,
  `${config.dist}/print.css`,
  `${config.dist}/admin.js`,
  `${config.dist}/array-reverse-polyfill.js`,
  `${config.dist}/blocks.js`,
  `${config.dist}/bundle.js`,
];

module.exports = () => {
  gulp.task('clean', () => del(paths));
};
