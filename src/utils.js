import dayjs from 'dayjs';

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const getArrayRandomElement = (array) => array[getRandomInteger(0, array.length - 1)];
const getRandomArray = (array) => {
  const arrayList = [];
  array.forEach((element) => {

    if (Math.random() > 0.5) {
      return;
    }
    arrayList.push(element);

  });
  return arrayList;

};
const generateDate = () => {
  const maxDaysGap = 31;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const day = dayjs().add(daysGap, 'day').toDate();
  return dayjs(day);
};
const generateTime = () => {
  const minute = getRandomInteger(1, 60);
  const hour = getRandomInteger(1, 24);
  const item = dayjs().add(minute, 'm').add(hour, 'hour').toDate();
  return dayjs(item);
};
const humanizeTimeFormat = (time) => {
  return dayjs(time).format('HH:mm');
};
const humanizeDateFormat = (data) => {
  return dayjs(data).format('D MMMM');
};
const changeDateFormat = (date) => {
  return dayjs(date).format('D/MM/YY');
};
const formatMilliseconds = (duration) => {
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  let days = parseInt((duration / (1000 * 60 * 60 * 24)) % 30);

  days = (days < 10) ? '' + days : days;
  hours = (hours < 10) ? '' + hours : hours;
  minutes = (minutes < 10) ? '' + minutes : minutes;

  if (days === '0') {
    return hours + 'H:' + minutes;
  }
  if (days === '0' && hours === '0') {
    return minutes;

  }

  return days + 'D:' + hours + 'H:' + minutes;
};
const isEventComing = (event) => {
  return dayjs().isAfter(event, 'D');
};
const isEventExpired = (event) => {
  return dayjs().isBefore(event, 'D');
};

export {
  getArrayRandomElement,
  getRandomArray,
  generateDate,
  generateTime,
  getRandomInteger,
  formatMilliseconds,
  humanizeTimeFormat,
  changeDateFormat,
  humanizeDateFormat,
  isEventComing,
  isEventExpired
};
