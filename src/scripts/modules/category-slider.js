import Flickity from 'flickity';

const setUpSliders = (container) => {
  const slider = container.querySelector('.postlist-categories');

  let selectedIndex = -1;
  const selectedSlide = slider.querySelector('[data-categories-selected]');

  if (selectedSlide) {
    selectedIndex = parseInt(selectedSlide.dataset.categoriesSelected, 10);
  }

  const isRightToLeft = document.documentElement.getAttribute('dir') === 'rtl';

  const nextButton = container.querySelector('[data-slider-next]');
  const prevButton = container.querySelector('[data-slider-prev]');

  const flcktyInstance = new Flickity(slider, {
    contain: true,
    groupCells: true,
    pageDots: false,
    cellAlign: 'left',
    prevNextButtons: false,
    watchCSS: true,
    rightToLeft: isRightToLeft,
    on: {
      ready: () => {
        Array.from(slider.querySelectorAll('li')).forEach((el) => {
          /* eslint-disable no-param-reassign */
          el.style.top = '0';
          el.style.bottom = '0';
          /* eslint-enable */
        });
      },
    },
  });

  const flickityIsActive = () => {
    if (!Object.prototype.hasOwnProperty.call(flcktyInstance, 'slides')) {
      return false;
    }

    if (!flcktyInstance.slides.length) {
      return false;
    }

    return true;
  };

  if (selectedIndex !== -1 && flickityIsActive()) {
    flcktyInstance.selectCell(selectedIndex, true, true);
  }

  const checkButtons = (index) => {
    if (!flickityIsActive()) {
      return;
    }

    if (index === 0) {
      prevButton.setAttribute('disabled', true);
    }

    if (index === flcktyInstance.slides.length - 1) {
      nextButton.setAttribute('disabled', true);
    }

    if (index < flcktyInstance.slides.length - 1) {
      nextButton.removeAttribute('disabled');
    }

    if (index > 0) {
      prevButton.removeAttribute('disabled');
    }
  };

  checkButtons(flcktyInstance.selectedIndex);
  flcktyInstance.on('change', checkButtons);

  container.addEventListener('click', (event) => {
    if (event.target.matches('[data-slider-next]')) {
      event.preventDefault();
      flcktyInstance.next();
    }

    if (event.target.matches('[data-slider-prev]')) {
      event.preventDefault();
      flcktyInstance.previous();
    }
  });
};

const init = () => {
  const postCategories = Array.from(document.querySelectorAll('[data-slider]'));

  if (postCategories.length < 1) {
    return;
  }

  postCategories.forEach(setUpSliders);
};

export default init;
