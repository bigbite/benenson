const init = () => {
  Array.from(document.querySelectorAll('a[href^="#"]'))
    .forEach((link) => {
      link.addEventListener('click', (e) => {
        const hashval = link.getAttribute('href');
        const target = document.querySelector(hashval);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        e.preventDefault();
      });
    });
};

export default init;
