const { benenson_data: benensonData } = window;

const init = () => {
  Array.from(document.querySelectorAll('.countdownTimer'))
    .forEach((timer) => {
      // return if timer has already finished
      if (timer.classList.contains('is-finished')) {
        return;
      }

      let finished = false;
      let days = 0;
      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      const daysElement = timer.querySelector('.countdownTimer-days span');
      const hoursElement = timer.querySelector('.countdownTimer-hours span');
      const minutesElement = timer.querySelector('.countdownTimer-mins span');
      const secondsElement = timer.querySelector('.countdownTimer-secs span');
      const endDate = new Date(timer.dataset.date).getTime();
      const timerRef = timer.dataset.ref;

      if (typeof endDate !== 'number') {
        return;
      }

      const calculate = () => {
        let startDate = new Date();
        startDate = startDate.getTime();

        // turn milliseconds into seconds to make calculations easier
        let timeRemaining = parseInt((endDate - startDate) / 1000, 10);

        if (timeRemaining < 0) {
          finished = true;
          return;
        }

        // divide time remaining by number of seconds in a day & remove days from timeRemaining
        days = parseInt(timeRemaining / 86400, 10);
        timeRemaining %= 86400;

        // divide time remaining by number of seconds in an hour & remove hours from timeRemaining
        hours = parseInt(timeRemaining / 3600, 10);
        timeRemaining %= 3600;

        /* divide time remaining by number of seconds in a minute &
        remove minutes from timeRemaining */
        minutes = parseInt(timeRemaining / 60, 10);
        timeRemaining %= 60;

        seconds = parseInt(timeRemaining, 10);

        daysElement.innerHTML = parseInt(days, 10);
        hoursElement.innerHTML = (`0${hours}`).slice(-2);
        minutesElement.innerHTML = (`0${minutes}`).slice(-2);
        secondsElement.innerHTML = (`0${seconds}`).slice(-2);
      };

      const timerFinished = () => {
        // HTTP request for retreiving reveal information
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function revealContent() {
          if (this.readyState === 4) {
            const jsonResponse = JSON.parse(this.responseText);

            const wrapper = document.createElement('div');
            wrapper.classList.add('coutdownTimer-revealContainer');

            const title = document.createElement('h2');
            const titleText = document.createTextNode(jsonResponse.attrs.revealTitle);
            title.appendChild(titleText);
            title.classList.add('countdownTimer-title');
            wrapper.append(title);

            const content = document.createElement('p');
            const contentText = document.createTextNode(jsonResponse.attrs.revealContent);
            content.appendChild(contentText);
            content.classList.add('countdownTimer-content');
            wrapper.append(content);

            const button = document.createElement('a');
            const buttonText = document.createTextNode('Hi there and greetings!');
            button.appendChild(buttonText);
            button.classList.add('btn', 'countdownTimer-btn');
            wrapper.append(button);

            document.querySelector(`.countdownTimer[data-ref="${timerRef}"]`).append(wrapper);
            timer.classList.add('is-finished');
          }
        };

        xhr.open('GET', `/wp-json/benenson/v1/reveal-content/${benensonData.post_id}/${timerRef}`);
        xhr.send();
      };

      const start = setInterval(() => {
        calculate();
        if (finished) {
          timerFinished();
          clearInterval(start);
        }
      }, 1000);
    });
};

export default init;
