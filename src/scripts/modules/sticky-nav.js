import { debounce } from 'lodash-es';
import searchToggle from './search-toggle';

let previousY = -1;
let stickyHeader;
let originalHeader;
let navHeight = -1;
let langSelector;

const isStuck = () => stickyHeader.classList.contains('is-stuck');
const stickNavigation = () => stickyHeader.classList.add('is-stuck');
const unstickNavigation = () => stickyHeader.classList.remove('is-stuck');

const isHidden = () => stickyHeader.classList.contains('is-hidden');
const hideNavigation = () => stickyHeader.classList.add('is-hidden');
const showNavigation = () => stickyHeader.classList.remove('is-hidden');

const canSticky = scrollY => scrollY >= navHeight;

const langSelectorIsVisible = () => langSelector && langSelector.classList.contains('is-visible');

const setNavHeight = () => {
  navHeight = originalHeader.getBoundingClientRect().top;
};

const scrollHandler = () => {
  const currentY = window.scrollY;
  const scrollingDown = previousY < currentY;
  previousY = currentY;

  if (currentY <= 0 || langSelectorIsVisible()) {
    hideNavigation();
    unstickNavigation();
    return;
  }

  if (isHidden()) {
    showNavigation();
  }

  if (isStuck() && !scrollingDown) {
    return;
  }

  if (isStuck() && scrollingDown) {
    unstickNavigation();
  }

  if (!isStuck() && canSticky(currentY) && !scrollingDown) {
    stickNavigation();
  }
};

const init = () => {
  originalHeader = document.querySelector('.page-header');
  stickyHeader = originalHeader.cloneNode(true);
  stickyHeader.classList.add('page-header--sticky');
  stickyHeader.classList.add(`page-header--${originalHeader.dataset.headerGlobal}`);
  stickyHeader.classList.remove('page-header--transparent-light');
  stickyHeader.classList.remove('page-header--transparent-dark');
  stickyHeader.removeAttribute('style');

  // prevent duplicate a11y declarations
  stickyHeader.setAttribute('aria-hidden', 'true');
  stickyHeader.removeAttribute('role');
  stickyHeader.removeAttribute('aria-label');
  const roles = stickyHeader.querySelectorAll('[role]');
  Array.from(roles).forEach(el => el.removeAttribute('role'));
  const labels = stickyHeader.querySelectorAll('[aria-label]');
  Array.from(labels).forEach(el => el.removeAttribute('aria-label'));
  const links = stickyHeader.querySelectorAll('a,button');
  Array.from(links).forEach(el => el.setAttribute('tabindex', '-1'));
  const items = stickyHeader.querySelectorAll('li[id]');
  Array.from(items).forEach(el => el.removeAttribute('id'));
  // /prevent duplicate a11y declarations

  document.body.insertBefore(stickyHeader, originalHeader);

  searchToggle(stickyHeader);
  setNavHeight();

  langSelector = document.querySelector('.language-selector');

  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('resize', debounce(setNavHeight, 250));
};

export default init;
