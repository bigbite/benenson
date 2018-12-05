import animate from './animate';

const HTML = document.documentElement;
let focusin;
let escape;

const toggleAriaBoolAttr = (el, attr) => {
  const value = el.getAttribute(attr);

  if (value === 'false') {
    return el.setAttribute(attr, 'true');
  }

  if (value === 'true') {
    return el.setAttribute(attr, 'false');
  }

  return el;
};

const setMobileOpenAria = () => {
  const hamburger = HTML.querySelector('.page-headerHamburger');
  const overlay = HTML.querySelector('.page-mobileMenuOverlay');

  toggleAriaBoolAttr(hamburger, 'aria-expanded');
  toggleAriaBoolAttr(overlay, 'aria-hidden');

  Array.from(overlay.querySelectorAll('a,button')).forEach((el) => {
    el.setAttribute('tabindex', '0');
  });

  HTML.querySelector('.page-mobileMenuHeader button').focus();
};

const setMobileClosedAria = (eatBurger = true) => {
  const hamburger = HTML.querySelector('.page-header:not(.page-header--sticky) .page-headerHamburger');
  const overlay = HTML.querySelector('.page-mobileMenuOverlay');

  toggleAriaBoolAttr(hamburger, 'aria-expanded');
  toggleAriaBoolAttr(overlay, 'aria-hidden');

  Array.from(overlay.querySelectorAll('a,button')).forEach((el) => {
    el.setAttribute('tabindex', '-1');
  });

  if (eatBurger) {
    hamburger.focus();
  }
};

const findNav = (origin) => {
  let parent = origin;

  for (; parent && parent !== document; parent = parent.parentNode) {
    if (parent.matches('.page-mobileMenuOverlay')) {
      return parent;
    }
  }

  return false;
};

// eslint-disable-next-line prefer-const
focusin = (event) => {
  const isStillInNav = findNav(event.target);

  if (isStillInNav) {
    return;
  }

  HTML.removeEventListener('focusin', focusin);
  HTML.removeEventListener('keyup', escape);
  HTML.classList.remove('menu-open');
  setMobileClosedAria(false);
};

escape = (event) => {
  // 27 = ESC
  if (event.keyCode !== 27) {
    return;
  }

  HTML.removeEventListener('focusin', focusin);
  HTML.removeEventListener('keyup', escape);
  HTML.classList.remove('menu-open');
  setMobileClosedAria();
};

const slideDown = (menuItem) => {
  const element = menuItem;
  const from = element.clientHeight;

  element.style.height = 'auto';
  element.style.opacity = '0';
  element.style.display = 'block';

  const to = element.clientHeight;

  element.style.height = `${from}px`;
  element.style.opacity = '1';

  animate({
    element,
    from,
    to,
    duration: 300,
  });
};

const slideUp = (menuItem) => {
  const element = menuItem;
  const from = element.clientHeight;
  const to = 0;

  animate({
    element,
    from,
    to,
    duration: 300,
    callback: () => {
      element.style.display = 'none';
    },
  });
};

const handler = (event) => {
  if (event.target.matches('[data-toggle-menu]')) {
    event.preventDefault();
    HTML.classList.toggle('menu-open');

    if (HTML.classList.contains('menu-open')) {
      HTML.addEventListener('keyup', escape);
      HTML.addEventListener('focusin', focusin);

      setMobileOpenAria();
    } else {
      setMobileClosedAria();
    }
  }

  if (event.target.matches('.page-mobileMenuToggle')) {
    event.preventDefault();
    const { parentElement } = event.target;

    if (!parentElement) {
      return;
    }

    toggleAriaBoolAttr(event.target, 'aria-expanded');

    const labelEl = event.target.childNodes[0];
    const label = event.target.getAttribute('aria-label');

    if (parentElement.classList.contains('is-open')) {
      slideUp(parentElement.querySelector('ul'));
      parentElement.classList.remove('is-open');

      event.target.setAttribute('aria-label', label.replace('Collapse', 'Expand'));
      labelEl.innerText = labelEl.innerText.replace('Collapse', 'Expand');
    } else {
      slideDown(parentElement.querySelector('ul'));
      parentElement.classList.add('is-open');

      event.target.setAttribute('aria-label', label.replace('Expand', 'Collapse'));
      labelEl.innerText = labelEl.innerText.replace('Expand', 'Collapse');
    }
  }
};

const init = () => HTML.addEventListener('click', handler);

export default init;
