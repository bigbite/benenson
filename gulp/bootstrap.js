const gutil = require('gulp-util');
const config = require('./config');

// Grab data from .env file. Assigned to `process.env`.
require('dotenv').config();

// Override NODE_ENV when using `gulp <task> --production`.
config.ENV = gutil.env.production ? 'production' : 'dev';

// Sync NODE_ENV to gulp env.
process.env.NODE_ENV = config.ENV;

// Require each task.
config.tasks.forEach((task) => {
  require(`./tasks/${task}`)();
});
