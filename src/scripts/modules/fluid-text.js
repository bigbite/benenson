const getFontSize = el => parseFloat(getComputedStyle(el).fontSize.replace(/[^0-9.]+/, ''));

const adjust = (element, multiplier = 1) => {
  const initialSize = getFontSize(element);
  const availableWidth = element.clientWidth;
  const overflowWidth = element.scrollWidth;

  // don't need to adjust
  if (overflowWidth <= availableWidth) {
    return;
  }

  let adjustedSize = Math.floor(initialSize / (overflowWidth / availableWidth));

  if (multiplier !== 1) {
    adjustedSize *= multiplier;
  }

  const existingStyle = element.getAttribute('style');
  // eslint-disable-next-line
  element.style.fontSize = `${adjustedSize}px`;
};

export default function fluidText(elements, multiplier) {
  Array.from(elements).forEach((element) => {
    const initialSize = getFontSize(element);
    let resizing;

    window.addEventListener('resize', () => {
      clearTimeout(resizing);
      resizing = setTimeout(() => {
        // restore initial font size to recompute for new client width
        if (getFontSize(element) < initialSize) {
          // eslint-disable-next-line
          element.style.fontSize = `${initialSize}px`;
        }

        adjust(element, multiplier);
      }, 250);
    });

    adjust(element, multiplier);
  });
}
