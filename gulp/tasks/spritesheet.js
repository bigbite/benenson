const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprites');
const config = require('../config');

const paths = {
  src: `${config.src}/icons/*.svg`,
  out: `${config.dist}/icons`,
};

module.exports = () => {
  gulp.task('spritesheet', () => gulp.src(paths.src)
    .pipe(svgSprite({
      mode: 'defs',
      preview: false,
    }))
    .pipe(gulp.dest(paths.out)));
};
