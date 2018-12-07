/**
 * Main dirs.
 */
const srcDir = 'src';
const distDir = '.';

/**
 * Globally accessible options.
 */
const config = {
  ENV: process.env.NODE_ENV = process.env.NODE_ENV || 'dev',

  // Tasks to use. Named as filenames in `gulp-tasks` folder
  tasks: [
    'browsersync',
    'clean',
    'images',
    'static',
    'styles',
    'watch',
    'webpack',
    'spritesheet',
  ],

  // Base paths
  src: srcDir,
  dist: distDir,

  // For Browsersync reloading
  isBrowserSync: false,
};

module.exports = config;
