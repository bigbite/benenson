export const workoutHeaderPosition = () => {
  const hero = document.querySelector('.page-hero.page-heroStyle--behindNav');
  const selector = document.querySelector('.page-header:not(.page-header--sticky');

  if (!hero || !selector) {
    return;
  }

  document.body.classList.add('page--heroBehindNav');

  const { bottom } = selector.getBoundingClientRect();
  hero.style.top = `-${bottom}px`;
};

const init = () => {
  workoutHeaderPosition();
  window.addEventListener('resize', workoutHeaderPosition);
};

export default init;
