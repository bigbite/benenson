import Flickity from 'flickity';
import 'flickity-as-nav-for';
import { debounce } from 'lodash-es';

const createArrowButton = (modifier) => {
  const button = document.createElement('button');
  button.setAttribute(`data-slider-${modifier}`, 1);
  return button;
};

const createSlider = (slider) => {
  const slides = slider.querySelector('.slides');

  if (!slides) {
    return;
  }

  const isRightToLeft = document.documentElement.getAttribute('dir') === 'rtl';

  const prevArrow = slider.querySelector('.slides-arrow--previous');
  const nextArrow = slider.querySelector('.slides-arrow--next');

  const slidesWithContent = Array.from(slider.querySelectorAll('.slide-contentWrapper'));

  slidesWithContent.forEach((wrapper) => {
    wrapper.addEventListener('click', (event) => {
      const isToggle = event.target.matches('.slider-toggleContent');
      const isOverlay = event.target.matches('.slide-contentWrapper.is-open');

      if (!isToggle && !isOverlay) {
        return;
      }

      event.preventDefault();

      wrapper.classList.toggle('is-open');

      if (wrapper.classList.contains('is-open')) {
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
      } else {
        prevArrow.style.display = 'block';
        nextArrow.style.display = 'block';
      }
    });
  });

  const slidesInstance = new Flickity(slides, {
    rightToLeft: isRightToLeft,
    prevNextButtons: false,
    pageDots: false,
  });

  if (nextArrow && prevArrow) {
    prevArrow.addEventListener('click', () => slidesInstance.previous());
    nextArrow.addEventListener('click', () => slidesInstance.next());
  }

  const sliderNavigation = slider.querySelector('.slider-nav');

  if (!sliderNavigation) {
    return;
  }

  const slideNavContainer = slider.querySelector('.slider-navContainer');
  let arrowsVisible = false;
  const hideArrows = () => slideNavContainer.classList.remove('has-arrows');
  const showArrows = () => slideNavContainer.classList.add('has-arrows');

  const workoutArrows = (instance) => {
    if (instance.slides.length > 1 && !arrowsVisible) {
      showArrows();
      arrowsVisible = true;
      return;
    }

    if (instance.slides.length > 1 && arrowsVisible) {
      return;
    }

    if (arrowsVisible) {
      arrowsVisible = false;
      hideArrows();
    }
  };

  const prevNavArrow = createArrowButton('prev');
  const nextNavArrow = createArrowButton('next');

  const navigationSlider = new Flickity(sliderNavigation, {
    asNavFor: slides,
    contain: true,
    pageDots: false,
    prevNextButtons: false,
    draggable: false,
    groupCells: true,
    rightToLeft: isRightToLeft,
    on: {
      ready() {
        if (!slideNavContainer) {
          return;
        }

        slideNavContainer.appendChild(prevNavArrow);
        slideNavContainer.appendChild(nextNavArrow);

        prevNavArrow.addEventListener('click', () => this.previous());
        nextNavArrow.addEventListener('click', () => this.next());

        workoutArrows(this);
      },
    },
  });

  navigationSlider.on('change', () => workoutArrows(navigationSlider));
  window.addEventListener('resize', debounce(() => workoutArrows(navigationSlider), 150));
};

const init = () => {
  const sliders = Array.from(document.querySelectorAll('.slider'));
  sliders.forEach(createSlider);
};

export default init;
