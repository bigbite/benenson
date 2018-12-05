const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const pseudoEnter = require('postcss-pseudo-class-enter');
const reporter = require('postcss-reporter');
const msUnit = require('postcss-ms-unit');
const cssnano = require('cssnano');
const config = require('../config');

// PostCSS transforms
const transforms = [
  autoprefixer({
    browsers: [
      '> 1%',
      'last 2 versions',
      'Firefox ESR',
      'not ie 10',
      'not ie_mob 10',
      'not chrome 49',
      'not android 4.4.3',
    ],
  }),
  msUnit(),
  pxtorem({
    prop_white_list: [
      'font',
      'font-size',
      'line-height',
      'letter-spacing',
    ],
  }),
  pseudoEnter(),
  reporter({
    clearMessages: true,
  }),
];

// PostCSS production transforms
if (config.ENV === 'production') {
  transforms.push(cssnano());
}

module.exports = transforms;
