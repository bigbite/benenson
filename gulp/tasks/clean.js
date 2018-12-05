const gulp = require('gulp');
const del = require('del');
const config = require('../config');

const paths = {
  dev: `${config.dist}`,
  production: [
    `${config.dist}/scripts`,
    `${config.dist}/styles`,
  ],
};

module.exports = () => {
  gulp.task('clean', () => del(config.ENV === 'dev' ? paths.dev : paths.production));
};
