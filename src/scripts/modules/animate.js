// noinspection JSAnnotator
const equations = {
  // t: current time, b: begInnIng value, c: change In value, d: duration
  easeInQuart: (
    current,
    oldProp,
    newProp,
    maxTime,
  ) => (newProp * ((current / maxTime) ** 4)) + oldProp,
};

const init = ({
  element,
  from,
  to,
  duration,
  property = 'height',
  unit = 'px',
  equation = 'easeInQuart',
  callback = false,
}) => {
  let startTime = false;
  const ele = element;
  let canContinue = true;

  const animate = (timestamp) => {
    if (!startTime) {
      startTime = timestamp;
    }

    if (!canContinue) {
      return false;
    }

    const passed = timestamp - startTime;

    let value;

    if (from < to) {
      value = Math.min(equations[equation](passed, from, to, duration), to);
    } else {
      value = Math.max(from - equations[equation](passed, to, from, duration), to);
    }

    ele.style[property] = `${value}${unit}`;

    if (passed < duration || value !== to) {
      return requestAnimationFrame(animate);
    }

    if (callback) {
      callback(element);
    }

    return true;
  };

  const cancel = () => {
    canContinue = false;
  };

  requestAnimationFrame(animate);
  return cancel;
};

export default init;
