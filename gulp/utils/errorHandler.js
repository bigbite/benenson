const notifier = require('node-notifier');
const stripansi = require('strip-ansi');

/**
 * Strip ansi and get rid of full file path.
 */
function formatError(err) {
  return stripansi(err)
    .replace(`${process.cwd()}/`, '');
}

function onError(err) {
  notifier.notify({
    title: 'Gulp build error',
    message: formatError(err.message),
    group: 1,
  });

  this.emit('end');
}

module.exports = onError;
