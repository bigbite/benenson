import classnames from 'classnames';
import DisplayComponent from './DisplayComponent';
import { SlideBuilder } from './build-slide';

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
  showTabs: {
    type: 'boolean',
    default: true,
  },
  hasContent: {
    type: 'boolean',
    default: true,
  },
};

const Builder = new SlideBuilder();

registerBlockType('benenson/block-slider', {
  title: __('Slider', 'benenson'),
  icon: 'welcome-widgets-menus',
  category: 'benenson',
  keywords: [
    __('Slider', 'benenson'),
    __('Carousel', 'benenson'),
    __('Scroller', 'benenson'),
  ],
  attributes: blockAttributes,

  edit: DisplayComponent,

  save: ({ attributes, className }) => {
    const { slides, hasContent, sliderId } = attributes;

    if (slides.length < 1) {
      return null;
    }

    return (<div id={ `slider-${sliderId}` } className="slider">
      <div className="slides-container">
        <div className="slides">
          { slides.map(slide => Builder.build(slide, hasContent, sliderId)) }
        </div>
        { attributes.hasArrows && [
          <button className="slides-arrow slides-arrow--next" aria-hidden="true">{ __('Next', 'benenson') }</button>,
          <button className="slides-arrow slides-arrow--previous" aria-hidden="true">{ __('Previous', 'benenson') }</button>,
        ] }
      </div>
      { attributes.showTabs && <div className="slider-navContainer" aria-hidden="true">
        <nav className="slider-nav">
          { slides.map((slide, index) => (
            <button className="slider-navButton" data-slide-index={ index }>{ slide.title }</button>
          )) }
        </nav>
      </div> }
    </div>);
  },
});
