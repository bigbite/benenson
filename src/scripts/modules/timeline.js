const getPos = (element) => {
  const childrenPos = element.getBoundingClientRect();
  const parentPos = element.parentElement.parentElement.getBoundingClientRect();
  const relativePos = {};

  relativePos.top = childrenPos.top - parentPos.top;
  relativePos.right = childrenPos.right - parentPos.right;
  relativePos.bottom = childrenPos.bottom - parentPos.bottom;
  relativePos.left = childrenPos.left - parentPos.left;

  return relativePos;
};

class Timeline {
  constructor(timeline) {
    this.timeline = timeline;
    this.items = Array.from(timeline.querySelectorAll('.timelineBlock-dateTime'));
    this.line = timeline.querySelector('.timeline-line');
    this.workout(timeline);
  }

  workout() {
    const heighest = this.items
      .filter((item, i) => (i + 1) % 2 === 0)
      .reduce((carry, current) => {
        const { top } = getPos(current);

        if (top < carry) {
          return carry;
        }

        return top;
      }, 0);

    this.items
      .filter((item, i) => i % 2 === 0)
      .forEach((item) => {
        item.parentElement.style.marginTop = `${heighest}px`; // eslint-disable-line no-param-reassign
      });

    this.items
      .filter((item, i) => (i + 1) % 2 === 0)
      .forEach((item) => {
        const pos = getPos(item);
        item.parentElement.style.marginTop = `${(heighest - pos.top) + 11}px`; // eslint-disable-line no-param-reassign
      });

    this.line.style.minWidth = `${this.timeline.querySelector('.timelineBlocks').offsetWidth}px`;
    this.line.style.top = `${(heighest + 52)}px`;
  }

  refresh() {
    this.items.forEach((item) => {
      item.parentElement.style.marginTop = '0px'; // eslint-disable-line no-param-reassign
    });

    this.workout(this.timeline);
  }
}

const init = () => {
  const timelines = Array.from(document.querySelectorAll('.timeline'));
  const timelineClasses = timelines.map(timeline => new Timeline(timeline));

  window.addEventListener('resize', () => {
    timelineClasses.forEach((timeline) => {
      timeline.refresh();
    });
  });
};

export default init;
