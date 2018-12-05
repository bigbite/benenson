import { workoutHeaderPosition } from './header-position';

const DISMISSED_KEY = 'language-selector-dismissed';

const dismissSelector = (event) => {
  event.preventDefault();
  const selector = document.querySelector('.language-selector');

  if (!selector) {
    return;
  }

  selector.classList.remove('is-visible');
  workoutHeaderPosition();

  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem(DISMISSED_KEY, '1');
};

const init = () => {
  if (window.localStorage && window.localStorage.getItem(DISMISSED_KEY)) {
    return;
  }

  const selector = document.querySelector('.language-selector');

  if (!selector) {
    return;
  }

  selector.classList.add('is-visible');
  workoutHeaderPosition();

  const closeButton = selector.querySelector('.language-selectorClose');

  if (!closeButton) {
    return;
  }

  closeButton.addEventListener('click', dismissSelector);
};

export default init;
