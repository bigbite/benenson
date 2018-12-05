const expandCategories = (event) => {
  event.preventDefault();

  const categories = document.querySelector('.category-list-expander');

  if (!categories) {
    return;
  }
  event.currentTarget.classList.toggle('is-open');
  categories.classList.toggle('is-visible');
};

const init = () => {
  const expandButton = document.querySelector('.category-expander');

  if (!expandButton) {
    return;
  }
  expandButton.addEventListener('click', expandCategories);
};

export default init;
