const shareBase = 'https://twitter.com/intent/tweet';

const handleTweetAction = (e) => {
  if (!e.target.classList.contains('btn')) {
    return;
  }

  e.preventDefault();

  const container = e.target.parentNode.parentNode;
  const content = container.querySelector('.tweetAction-content').innerText;

  const fullUrl = `${shareBase}?text=${encodeURIComponent(content)}`;

  window.open(fullUrl);
};

export default () => {
  const blocks = document.getElementsByClassName('tweetAction');

  if (!blocks.length) {
    return;
  }

  Array.from(blocks).forEach(block => block.addEventListener('click', handleTweetAction));
};
