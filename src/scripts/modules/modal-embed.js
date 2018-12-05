const isUrl = str => str.indexOf('http') === 0;
const isEmbed = str => isUrl(str) && (str.indexOf('embed') !== -1 || str.indexOf('player') !== -1);
const isID = str => !isEmbed(str);
const isVimeo = str => (isUrl(str) && str.indexOf('vimeo') !== -1) || (isID(str) && /^\d+$/.test(str));
const isYoutube = str => (isUrl(str) && str.indexOf('youtube') !== -1) || isID(str);
const el = tagName => document.createElement(tagName);
const div = () => el('div');

const modals = {};

let youtubeApiLoaded = false;
let vimeoApiLoaded = false;

window.onYouTubeIframeAPIReady = () => {
  Object.keys(modals).forEach((key) => {
    const modal = modals[key].container;
    const url = modal.querySelector('iframe').getAttribute('src');

    if (!isYoutube(url)) {
      return;
    }

    modals[key].player = new window.YT.Player(key);
    modals[key].play = 'playVideo';
    modals[key].pause = 'pauseVideo';
  });
};

// mimic YT API call name
window.onVimeoIframeAPIReady = () => {
  Object.keys(modals).forEach((key) => {
    const modal = modals[key].container;
    const iframe = modal.querySelector('iframe');
    const url = iframe.getAttribute('src');

    if (!isVimeo(url)) {
      return;
    }

    modals[key].player = new window.Vimeo.Player(iframe);
    modals[key].play = 'play';
    modals[key].pause = 'pause';
  });
};

const loadYoutubeApi = () => {
  if (youtubeApiLoaded) {
    return;
  }

  const api = el('script');
  document.head.appendChild(api);
  api.src = 'https://www.youtube.com/player_api';

  youtubeApiLoaded = true;
};

const loadVimeoApi = () => {
  if (vimeoApiLoaded) {
    return;
  }

  const api = el('script');
  document.head.appendChild(api);
  api.onload = window.onVimeoIframeAPIReady;
  api.src = 'https://player.vimeo.com/api/player.js';

  vimeoApiLoaded = true;
};

const createPlayer = (key, url) => {
  if (isVimeo(url)) {
    loadVimeoApi(key);
  } else if (isYoutube(url)) {
    loadYoutubeApi(key);
  }
};

const getEmbedUrl = (embed) => {
  // https://player.vimeo.com/video/000000000/?api=1
  // https://www.youtube.com/embed/kjahsdlkaj/?enablejsapi=1&html5=1
  if (isEmbed(embed)) {
    return embed;
  }

  if (isUrl(embed) && isVimeo(embed)) {
    let str = embed.split('/');
    str = str.reduce((last, curr) => {
      if (/\d+/.test(last)) {
        return last;
      }

      if (/\d+/.test(curr)) {
        return curr;
      }

      const newCurr = curr.split('?').shift();

      if (/\d+/.test(newCurr)) {
        return newCurr;
      }

      return last;
    }, '');

    return `https://player.vimeo.com/video/${str}/?api=1`;
  }

  if (isID(embed) && isVimeo(embed)) {
    return `https://player.vimeo.com/video/${embed}/?api=1`;
  }

  if (isUrl(embed) && isYoutube(embed)) {
    return `${embed.replace('watch?v=', 'embed/')}?enablejsapi=1&html5=1`;
  }

  if (isID(embed) && isYoutube(embed)) {
    return `https://www.youtube.com/embed/${embed}/?enablejsapi=1&html5=1`;
  }

  return embed;
};

const hideModal = (key) => {
  if (!modals[key]) {
    return;
  }

  const modal = modals[key];
  modal.container.classList.remove('is-open');
  document.documentElement.classList.remove('modal-open');
  modals[key].visible = false;

  if (Object.prototype.hasOwnProperty.call(modal, 'player')) {
    modal.player[modal.pause]();
  }
};

const toggleModal = (key) => {
  if (!modals[key]) {
    return;
  }

  const modal = modals[key];
  modal.container.classList.toggle('is-open');
  document.documentElement.classList.toggle('modal-open');
  modals[key].visible = modal.container.classList.contains('is-open');


  if (Object.prototype.hasOwnProperty.call(modal, 'player')) {
    if (modal.container.classList.contains('is-open')) {
      modal.player[modal.play]();
    } else {
      modal.player[modal.pause]();
    }
  }
};

const createHide = key => () => hideModal(key);

const createModal = ({ key, embed }) => {
  const container = div();
  const innerContainer = div();
  const modal = div();
  const videoContainer = div();
  const embedContainer = el('iframe');
  const closeButton = el('button');
  const embedUrl = getEmbedUrl(embed);

  container.classList.add('modal-container');
  innerContainer.classList.add('container');
  modal.classList.add('modal');
  videoContainer.classList.add('fluid-videoContainer');
  closeButton.classList.add('modal-close');
  closeButton.classList.add('btn');

  closeButton.textContent = 'Close';

  embedContainer.setAttribute('id', key);
  embedContainer.setAttribute('src', embedUrl);
  container.setAttribute('data-modal-key', key);

  videoContainer.appendChild(embedContainer);
  modal.appendChild(videoContainer);
  innerContainer.appendChild(closeButton);
  innerContainer.appendChild(modal);
  container.appendChild(innerContainer);
  document.body.appendChild(container);

  const toggle = createHide(key);
  container.addEventListener('click', toggle);
  innerContainer.addEventListener('click', toggle);
  closeButton.addEventListener('click', toggle);

  modals[key] = {
    visible: false,
    container,
  };

  createPlayer(key, embedUrl);
};

const clickHandler = (event) => {
  event.preventDefault();
  const { target } = event;
  const embed = target.dataset.modalEmbed;
  const key = btoa(embed);

  if (!modals[key]) {
    createModal({
      key,
      embed,
    });
  }

  // delay to allow the container to be added, this then shows the fade in animation.
  setTimeout(() => toggleModal(key), 10);
};

const keyboardHandler = (event) => {
  // 27 = ESC
  if (event.keyCode !== 27) {
    return;
  }

  let aModalIsOpen = false;
  let modalIndex = null;

  Object.keys(modals).forEach((key) => {
    if (modals[key].visible) {
      aModalIsOpen = true;
      modalIndex = key;
    }
  });

  if (!aModalIsOpen) {
    return;
  }

  toggleModal(modalIndex);
};

const init = () => {
  const modalOpeners = Array.from(document.querySelectorAll('[data-modal-embed]'));
  modalOpeners.forEach(modal => modal.addEventListener('click', clickHandler));
  document.addEventListener('keyup', keyboardHandler);
};

export default init;
