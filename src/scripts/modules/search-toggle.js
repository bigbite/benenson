const hideSearchContainer = (target, removeEventListeners) => {
  target.classList.remove('search-open');

  if (removeEventListeners) {
    removeEventListeners();
  }
};

const keyboard = (event, ...args) => {
  if (event.keyCode !== 27 /* ESC */) {
    return;
  }

  hideSearchContainer(...args);
};

const pointer = (event, ...args) => {
  const container = '.page-headerSearchContainer .page-search';

  if (event.target.matches(container) || event.target.parentElement.matches(container) || event.target.matches('[data-toggle-search]')) {
    return;
  }

  hideSearchContainer(...args);
};

const createEventListeners = (target) => {
  let keyEvent;
  let pointEvent;

  const removeListeners = () => {
    document.documentElement.removeEventListener('keyup', keyEvent);
    document.documentElement.removeEventListener('mouseup', pointEvent);
    document.documentElement.removeEventListener('touchend', pointEvent);
  };

  keyEvent = event => keyboard(event, target, removeListeners);
  pointEvent = event => pointer(event, target, removeListeners);

  document.documentElement.addEventListener('keyup', keyEvent);
  document.documentElement.addEventListener('mouseup', pointEvent);
  document.documentElement.addEventListener('touchend', pointEvent);
};

const init = (container = document) => {
  const toggleSearchButton = container.querySelector('[data-toggle-search]');

  if (!toggleSearchButton) return;

  toggleSearchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const { parentElement } = toggleSearchButton;

    if (!parentElement) {
      return;
    }

    document.documentElement.classList.toggle('search-open');

    if (document.documentElement.classList.contains('search-open')) {
      parentElement.querySelector('input').focus();
      createEventListeners(document.documentElement);
    }
  });
};

export default init;
