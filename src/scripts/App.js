import Expose from './modules/Expose';
import filterPosts from './modules/filter-posts';
import languageSelector from './modules/language-selector';
import searchToggle from './modules/search-toggle';
import mobileMenu from './modules/mobile-menu';
import headerPosition from './modules/header-position';
// import fluidIframe from './modules/fluid-iframe';
import tweetAction from './modules/tweet-action';
import stickyNav from './modules/sticky-nav';
import categorySlider from './modules/category-slider';
import modalEmbed from './modules/modal-embed';
import sliderBlock from './modules/slider-block';
import subcatDrops from './modules/subcategory-dropdown';
import categoryExpander from './modules/category-expander';
import fluidText from './modules/fluid-text';

import './polyfills';

const App = () => {
  filterPosts();
  languageSelector();
  headerPosition();
  searchToggle(document.querySelector('.page-header:not(.page-header--sticky)'));
  mobileMenu();
  // fluidIframe();
  tweetAction();
  stickyNav();
  categorySlider();
  modalEmbed();
  sliderBlock();
  subcatDrops();
  categoryExpander();

  fluidText(document.getElementsByClassName('article-shareTitle'), 0.9);

  return {
    using: Expose(),
  };
};

/**
 * Export to `window.App.default()`.
 */
export default App;
