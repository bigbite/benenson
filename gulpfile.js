const gulp = require('gulp');
require('./gulp/bootstrap');

/**
 * Default task.
 */
gulp.task('default', ['styles', 'webpack:build', 'static', 'images']);

/**
 * Build task. Cleans and runs default task.
 */
gulp.task('build', ['clean'], () => {
  gulp.start('default');
});
