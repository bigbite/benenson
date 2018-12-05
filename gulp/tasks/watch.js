const gulp = require('gulp');
const browserSync = require('browser-sync');
const fs = require('fs');
const path = require('path');
const os = require('os');

const config = require('../config');

const paths = {
  watch: [
    { src: `${config.src}/styles/**`, task: ['styles'] },
    { src: `${config.src}/scripts/**`, task: ['webpack:build-dev'] },
    { src: `${config.src}/images/**/*.{png,jpg,jpeg,gif,svg}`, task: ['images'] },
    { src: `${config.src}/static/**`, task: ['static'] },
  ],
};

module.exports = () => {
  gulp.task('watch', () => {
    // Loop config watch paths and run watch.
    paths.watch.forEach((watch) => {
      gulp.watch(watch.src, watch.task);
    });
  });
};
