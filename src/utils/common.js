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
const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export {
  getArrayRandomElement,
  getRandomArray,
  getRandomInteger,
  isEscEvent,
  updateItem,
  SortType
};
