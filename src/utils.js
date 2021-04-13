import dayjs from 'dayjs';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const getArrayRandomElement = (array) => array[getRandomInteger(0, array.length - 1)];
const getRandomArray = (array) => {
  return array.filter(() => Math.random() > 0.5);
};
const generateDate = () => {
  const maxDaysGap = 31;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const day = dayjs().add(daysGap, 'day').toDate();
  return dayjs(day);
};
const generateDateFrom = () => {
  const hour = getRandomInteger(1, 24);
  const minute = getRandomInteger(1, 60);
  const item = dayjs().add(hour, 'hour').add(minute, 'm').toDate();
  return dayjs(item);
};
const generateDateTo = (dateFrom) => {
  const hour = getRandomInteger(1, 24);
  const minute = getRandomInteger(1, 60);
  const dateTo = dayjs(dateFrom).add(hour, 'hour').add(minute, 'm').toDate();
  return dayjs(dateTo);

};
const humanizeTimeFormat = (time) => {
  return dayjs(time).format('HH:mm');
};
const humanizeDateFormat = (date) => {
  return dayjs(date).format('D MMMM');
};
const humanizeEditEventDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YY');
};
const isEventComing = (event) => {
  return dayjs().isAfter(event, 'D');
};
const isEventExpired = (event) => {
  return dayjs().isBefore(event, 'D');
};
const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
const calcPrice = (offers) => {
  let price = 0;
  offers.forEach((item) => price += item.price);
  return price;
};
const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  getArrayRandomElement,
  getRandomArray,
  generateDate,
  generateDateFrom,
  generateDateTo,
  getRandomInteger,
  humanizeTimeFormat,
  humanizeDateFormat,
  isEventComing,
  isEventExpired,
  render,
  createElement,
  humanizeEditEventDateFormat,
  calcPrice,
  RenderPosition,
  isEscEvent
};
