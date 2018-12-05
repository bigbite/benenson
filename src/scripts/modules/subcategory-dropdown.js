export default () => {
  const selects = document.querySelectorAll('.news-sidebar select');
  if (!selects.length) return;

  Array.from(selects).forEach((el) => {
    el.addEventListener('change', (event) => {
      document.location = event.target.value;
    });
  });
};
