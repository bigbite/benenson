const init = () => {
  Array.from(document.querySelectorAll('.inlineVideo'))
    .forEach((video) => {
      video.addEventListener('click', (e) => {
        e.preventDefault();

        const videoUrl = video.querySelector('iframe').dataset.src;

        video.classList.add('inlineVideo--played');
        video.querySelector('iframe').setAttribute('src', videoUrl);
      });
    });
};

export default init;
