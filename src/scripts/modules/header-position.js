export const workoutHeaderPosition = () => {
  const header = document.querySelector('.page-header');
  const selector = document.querySelector('.language-selector');

  if (!header || !selector) {
    return;
  }

  if (!selector.classList.contains('is-visible')) {
    header.removeAttribute('style');
    return;
  }

  const { bottom } = selector.getBoundingClientRect();
  header.style.top = `${bottom}px`;
};

const init = () => {
  workoutHeaderPosition();
  window.addEventListener('resize', workoutHeaderPosition);
};

export default init;
