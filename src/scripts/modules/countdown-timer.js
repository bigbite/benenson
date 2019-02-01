const init = () => {
  Array.from(document.querySelectorAll('.countdownTimer'))
    .forEach((timer) => {
      let days = 0;
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      let count = 0;

      const daysElement = timer.querySelector('.countdownTimer-days span');
      const hoursElement = timer.querySelector('.countdownTimer-hours span');
      const minutesElement = timer.querySelector('.countdownTimer-mins span');
      const secondsElement = timer.querySelector('.countdownTimer-secs span');
      const endDate = new Date(timer.dataset.date).getTime();

      if (typeof (endDate) !== 'number') {
        return;
      }

      const calculate = () => {
        count += 1;

        let startDate = new Date();
        startDate = startDate.getTime();

        // turn milliseconds into seconds to make calculations easier
        let timeRemaining = parseInt((endDate - startDate) / 1000, 10);

        if (timeRemaining >= 0) {
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

          if (count >= 1) {
            timer.classList.add('countdownTimer--set');
          }
        }
      };

      setInterval(calculate, 1000);
    });
};

export default init;
