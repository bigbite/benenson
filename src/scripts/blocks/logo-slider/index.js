import classnames from 'classnames';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

const blockAttributes = {
  sliderId: {
    type: 'string',
  },
  slides: {
    type: 'array',
    default: [],
  },
  hasArrows: {
    type: 'boolean',
    default: true,
  },
  perSlide: {
    type: 'interger',
    default: 4,
  },
};

registerBlockType('benenson/block-logo-slider', {
  title: __('Logo slider', 'benenson'),
  icon: 'images-alt2',
  category: 'benenson',
  keywords: [
    __('Slider', 'benenson'),
    __('Carousel', 'benenson'),
    __('Scroller', 'benenson'),
  ],
  attributes: blockAttributes,

  edit: DisplayComponent,

  save: ({ attributes, className }) => {
    const { slides, logoSliderId } = attributes;
    const sliderClasses = classnames(
      'logoSlider',
      `logoSlider-${attributes.perSlide}perSlide`,
    );

    if (slides.length < 1) {
      return null;
    }

    return (
      <div className={ sliderClasses }>
        <div class="logoSlides-container">
          <div class="logoSlides">
            { slides.map((slide, index) => (
              <div className="logoSlide">
                <div className="logoSlide-contentContainer">
                  { slide.imageLink !== '' ?
                    <a href={ slide.imageLink } target={ slide.newTab ? '_blank' : '_self' }>
                      <img src={ `${slide.imageUrl}` }/>
                    </a>
                  :
                    <img src={ `${slide.imageUrl}` }/>
                  }
                </div>
              </div>
            )) }
          </div>
          { attributes.hasArrows && [
            <button className="logoSlider-arrow logoSlider-arrow--next" aria-hidden="true">{ __('Next', 'benenson') }</button>,
            <button className="logoSlider-arrow logoSlider-arrow--previous" aria-hidden="true">{ __('Previous', 'benenson') }</button>,
          ] }
        </div>
      </div>
    );
  },
});
