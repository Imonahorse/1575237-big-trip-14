import {
  generateDate,
  generateDateFrom,
  generateDateTo,
  calcPrice
} from '../utils/event.js';
import {
  getArrayRandomElement,
  getRandomArray,
  getRandomInteger
} from '../utils/common.js';
import {nanoid} from 'nanoid';

const TYPES = [
  'check-in',
  'sightseeing',
  'restaurant',
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
];
const CITIES = [
  'London',
  'Paris',
  'Moscow',
  'Amsterdam',
  'Warsaw',
  'New-Vasiuky',
];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet constius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus constius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const OFFERS = [
  {
    title: 'Add luggage',
    price: 30,
  },
  {
    title: 'Switch to comfort class',
    price: 100,
  },
  {
    title: 'Add meal',
    price: 15,
  },
  {
    title: 'Choose seats',
    price: 5,
  },
  {
    title: 'Travel by train',
    price: 40,
  },
];
const PICTURE = {
  src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
  alt: getArrayRandomElement(DESCRIPTIONS),
};
const PHOTOS_MAX_LENGTH = 5;

const createRandomPicturesArray = () => {
  return new Array(getRandomInteger(PHOTOS_MAX_LENGTH)).fill().map(() => PICTURE);
};
const msToTime = (duration) => {
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (hours === 0) {
    return minutes + 'M';
  }

  if (minutes === 0) {
    return hours + 'H';
  }

  return hours + 'H :' + minutes + 'M';
};

const createEvent = () => {
  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);
  const duration = msToTime(dateTo.diff(dateFrom));
  const offers = getRandomArray(OFFERS);

  return {
    type: getArrayRandomElement(TYPES),
    dueDate: generateDate(),
    dateFrom,
    dateTo,
    duration,
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: {
      name: getArrayRandomElement(CITIES),
      description: getRandomArray(DESCRIPTIONS),
      picture: createRandomPicturesArray(),
    },
    offers,
    basePrice: calcPrice(offers),
  };
};

export {createEvent};
