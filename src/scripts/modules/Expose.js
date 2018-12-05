/* eslint-disable no-console */
/**
 * Expose functions/modules to be used with the `.using()` method on App
 * to conditionally run functions/modules if they are page dependant.
 *
 * @param {Object} fns - Exposed functions
 */
function expose(fns = {}) {
  function using(fnName, ...args) {
    if (Array.isArray(fnName)) {
      fnName.map((fn) => {
        let fnArgs = args;
        let func = fn;

        if (Array.isArray(func)) {
          [func, ...fnArgs] = func;
        }

        return using(func, ...fnArgs);
      });

      return { using };
    }

    if (fns[fnName]) {
      fns[fnName](...args);
    } else {
      throw new Error(`The module \`${fnName}\` does not exist, or is not exposed for using.`);
    }

    return this;
  }

  return using;
}

export default expose;
