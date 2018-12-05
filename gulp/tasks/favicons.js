const gulp = require('gulp');
const favicons = require('gulp-favicons');
const del = require('del');
const config = require('../config');

const paths = {
  src: `${config.src}/favicons/index.html`,
  srcDir: `${config.src}/favicons`,
  out: 'public/assets/favicons/',
  options: {
    files: {
      src: `${config.src}/favicons/favicon.png`,
      dest: '../../public/assets/favicons/',
      iconsPath: '/assets/favicons',
    },
    icons: {
      appleStartup: false,
    },
  },
};

module.exports = () => {
  gulp.task('favicons:clean', () => del(paths.out));

  gulp.task('favicons', ['favicons:clean'], () => gulp.src(paths.src)
    .pipe(favicons(paths.options))
    .pipe(gulp.dest(paths.srcDir)));
};
