import Flickity from 'flickity';
import 'flickity-as-nav-for';
import { debounce } from 'lodash-es';

const createSlider = (slider) => {
  const slides = slider.querySelector('.logoSlides');

  if (!slides) {
    return;
  }

  const isRightToLeft = document.documentElement.getAttribute('dir') === 'rtl';

  const prevArrow = slider.querySelector('.logoSlider-arrow--previous');
  const nextArrow = slider.querySelector('.logoSlider-arrow--next');

  const slidesInstance = new Flickity(slides, {
    rightToLeft: isRightToLeft,
    prevNextButtons: false,
    pageDots: false,
    contain: true,
  });

  if (nextArrow && prevArrow) {
    prevArrow.addEventListener('click', () => slidesInstance.previous());
    nextArrow.addEventListener('click', () => slidesInstance.next());
  }
};

const init = () => {
  const sliders = Array.from(document.querySelectorAll('.logoSlider'));
  sliders.forEach(createSlider);
};

export default init;
