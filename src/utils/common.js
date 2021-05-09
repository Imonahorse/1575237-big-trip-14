const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const getArrayRandomElement = (array) => array[getRandomInteger(0, array.length - 1)];
const getRandomArray = (array) => {
  return array.filter(() => Math.random() > 0.5);
};
const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
const msToTime = (duration) => {
  const days = Math.floor(duration / (1000 * 60 * 60 * 24) % 30);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (days === 0) {
    return hours + 'H :' + minutes + 'M';
  }

  if (hours === 0) {
    return minutes + 'M';
  }

  if (minutes === 0) {
    return hours + 'H';
  }

  return days + 'D ' + hours + 'H :' + minutes + 'M';
};

export {
  getArrayRandomElement,
  getRandomArray,
  getRandomInteger,
  isEscEvent,
  SortType,
  msToTime
};
