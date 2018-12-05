const gulp = require('gulp');
const gutil = require('gulp-util');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const config = require('../config');

const paths = {
  src: `${config.src}/images/**/*.{jpg,jpeg,png,gif,svg}`,
  out: `${config.dist}/images`,
};

module.exports = () => {
  gulp.task('images', () => {
    if (config.ENV === 'production') {
      gutil.log(gutil.colors.yellow('Image tasks don\'t run on production.'));

      return gulp;
    }

    return gulp.src(paths.src)
      .pipe(changed(paths.src))
      .pipe(imagemin({

        // jpg
        progressive: true,

        // gif
        interlaced: true,

        // svg
        svgoPlugins: [
          { removeViewBox: false }, // Keep viewBox attr
          { cleanupIDs: false }, // Keep ID's
          { removeHiddenElems: false }, // Keep opacity="0" elems
          { _collections: false }, // Keep preserveAspectRatio
          { removeUnknownsAndDefaults: false }, // Keep ID on <svg> tag
        ],

        // plugins
        use: [

          /**
           * pngquat, better compression than the default optipng
           * http://pointlessramblings.com/posts/pngquant_vs_pngcrush_vs_optipng_vs_pngnq
           */
          pngquant({
            quality: '75-80',
            speed: 4,
          }),
        ],
      }))
      .pipe(gulp.dest(paths.out));
  });
};
