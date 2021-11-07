import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const datetimePicker = document.getElementById('datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const timer = document.querySelector('.timer');
const field = document.querySelector('.field');
const days = document.querySelector('span[data-days]');
const descLabel = document.querySelector('.label');
const hours = document.querySelector('span[data-hours]');
const minutes = document.querySelector('span[data-minutes]');
const seconds = document.querySelector('span[data-seconds]');
const value = document.querySelector('.value');

startBtn.disabled = true;

let countDown = {};
let currentDate = new Date();
let selectedDate = new Date();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    if (selectedDate > currentDate) {
      startBtn.disabled = false;
    } else {
      Notify.failure('Please choose a date in the future');
    }
  },
};

flatpickr(datetimePicker, options);

startBtn.addEventListener('click', onClick);

function onClick() {
  const timerId = setInterval(() => {
    currentDate = new Date();
    if (currentDate < selectedDate) {
      countDown = convertMs(selectedDate - currentDate);
      showCountDown(countDown);
      startBtn.disabled = true;
    } else {
      clearInterval(timerId);
      Notify.success('Time is up');
    }
  }, 1000);
}

function showCountDown(countDown) {
  days.textContent = addLeadingZero(countDown.days);
  hours.textContent = addLeadingZero(countDown.hours);
  minutes.textContent = addLeadingZero(countDown.minutes);
  seconds.textContent = addLeadingZero(countDown.seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};