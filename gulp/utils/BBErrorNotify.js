const notifier = require('node-notifier');
const stripansi = require('strip-ansi');

/**
 * Handle error notifications via custom plugin.
 */
function BBErrorNotify() {}

BBErrorNotify.prototype.handleError = function (error) {
  const title = 'Webpack build error';

  const message = stripansi(error)
    .replace(`${__dirname}/`, '')
    .replace('SyntaxError: ', '');

  return { title, message };
};

BBErrorNotify.prototype.handleWarning = function (warning) {
  const title = 'Webpack build warning';

  let message = stripansi(warning)
    .replace(`${__dirname}/`, '')
    .replace('error ', '')
    .replace(/(\r?\n|\r)/gm, '')
    .split('  ');

  message.pop();
  message = `${message[0]}:${message[2]} (${message[1]})`;

  return { title, message };
};

BBErrorNotify.prototype.compilationDone = function (stats) {
  const isError = stats.hasErrors();
  const isWarn = stats.hasWarnings();

  if (!isError && !isWarn) {
    return;
  }

  if (isError) {
    notifier.notify(this.handleError(stats.compilation.errors[0].error.toString()));
  } else if (isWarn) {
    notifier.notify(this.handleWarning(stats.compilation.warnings[0].warning.toString()));
  }
};

BBErrorNotify.prototype.apply = function (compiler) {
  compiler.plugin('done', this.compilationDone.bind(this));
};

module.exports = BBErrorNotify;
