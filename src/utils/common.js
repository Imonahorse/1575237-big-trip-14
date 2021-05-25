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
const msToTime = (duration) => {
  const days = Math.floor(duration / (1000 * 60 * 60 * 24) % 30);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (days === 0 && hours === 0 && minutes === 0) {
    return '00D 00H 00M';
  }

  if (days === 0 && hours === 0) {
    return '00D ' + '00H' + minutes < 10 ? '0' + minutes + 'M' : minutes + 'M';
  }

  if (days === 0) {
    return '00D ' + (hours < 10 ? '0' + hours + 'H ' : hours + 'H ') + (minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
  }

  return (days < 10 ? '0' + days + 'D ' : days + 'D ') + (hours < 10 ? '0' + hours + 'H ' : hours + 'H ') + (minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
};
const isOnline = () => {
  return window.navigator.onLine;
};

export {
  getArrayRandomElement,
  getRandomArray,
  getRandomInteger,
  isEscEvent,
  msToTime,
  isOnline
};
