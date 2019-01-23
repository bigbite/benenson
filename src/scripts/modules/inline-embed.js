const isUrl = str => str.indexOf('http') === 0;
const isEmbed = str => isUrl(str) && (str.indexOf('embed') !== -1 || str.indexOf('player') !== -1);
const isID = str => !isEmbed(str);
const isVimeo = str => (isUrl(str) && str.indexOf('vimeo') !== -1) || (isID(str) && /^\d+$/.test(str));
const isYoutube = str => (isUrl(str) && str.indexOf('youtube') !== -1) || isID(str);
const el = tagName => document.createElement(tagName);

const getEmbedUrl = (embed, autoplay = false) => {
  // https://player.vimeo.com/video/000000000/?api=1
  // https://www.youtube.com/embed/kjahsdlkaj/?enablejsapi=1&html5=1
  if (isEmbed(embed)) {
    return `${embed}${autoplay ? '?autoplay=1' : ''}`;
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

    return `https://player.vimeo.com/video/${str}/?api=1${autoplay ? '&autoplay=1' : ''}`;
  }

  if (isID(embed) && isVimeo(embed)) {
    return `https://player.vimeo.com/video/${embed}/?api=1${autoplay ? '&autoplay=1' : ''}`;
  }

  if (isUrl(embed) && isYoutube(embed)) {
    return `${embed.replace('watch?v=', 'embed/')}?enablejsapi=1&html5=1${autoplay ? '&autoplay=1' : ''}`;
  }

  if (isID(embed) && isYoutube(embed)) {
    return `https://www.youtube.com/embed/${embed}/?enablejsapi=1&html5=1${autoplay ? '&autoplay=1' : ''}`;
  }

  return `${embed}${autoplay ? '?autoplay=1' : ''}`;
};

const createInlineEmbed = ({ container, key, embed }) => {
  const video = el('iframe');
  const embedUrl = getEmbedUrl(embed, true);

  video.setAttribute('id', key);
  video.setAttribute('src', embedUrl);
  container.appendChild(video);
  container.classList.add('inlineVideo--played');
};

const clickHandlerInline = (event) => {
  event.preventDefault();
  const { target } = event;
  const embed = target.dataset.inlineEmbed;
  const container = target.closest('.inlineVideo');
  const key = btoa(embed);

  createInlineEmbed({ container, key, embed });
};

const init = () => {
  const inlineEmbeds = Array.from(document.querySelectorAll('[data-inline-embed]'));
  inlineEmbeds.forEach(inlineEmbed => inlineEmbed.addEventListener('click', clickHandlerInline));
};

export default init;
