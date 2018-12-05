const init = () => {
  Array.from(document.querySelectorAll('.wp-block-embed.is-type-video'))
    .forEach((embed) => {
      const iframe = embed.querySelector('iframe');

      if (!iframe) {
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.classList.add('fluid-videoContainer');

      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
    });
};

export default init;
