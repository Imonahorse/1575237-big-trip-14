import {
  generateDate,
  generateDateFrom,
  generateDateTo,
  calcPrice
} from '../utils/event.js';
import {
  getArrayRandomElement,
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
const OFFERS_TITLE = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train'];
const OFFERS_PRICE = [30, 100, 15, 5, 40];
const PHOTOS_MIN_LENGTH = 0;
const PHOTOS_MAX_LENGTH = 5;
const OFFERS_MIN_COUNT = 1;
const OFFERS_MAX_COUNT = 10;

const createRandomPicturesArray = () => {
  return new Array(getRandomInteger(PHOTOS_MIN_LENGTH, PHOTOS_MAX_LENGTH)).fill().map(() => {
    const img = {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
      alt: getArrayRandomElement(DESCRIPTIONS),
    };
    return img;
  });
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
const getOfferTypes = () => {
  const offerTypes = new Map();

  TYPES.forEach((type) => {
    const offersCount = getRandomInteger(OFFERS_MIN_COUNT, OFFERS_MAX_COUNT);
    const offers = [];
    for (let i = 0; i < offersCount; i++) {
      offers.push({
        title: getArrayRandomElement(OFFERS_TITLE),
        price: getArrayRandomElement(OFFERS_PRICE),
      });
    }
    offerTypes.set(type, offers);
  });
  return offerTypes;
};
const getDestinationTypes = () => {
  const destinationTypes = new Map();

  CITIES.forEach((city) => {
    const pictures = createRandomPicturesArray();
    const descriptions = getArrayRandomElement(DESCRIPTIONS);

    destinationTypes.set(city, {descriptions, pictures});
  });
  return destinationTypes;
};

const createEvent = () => {
  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);
  const duration = msToTime(dateTo.diff(dateFrom));
  const offerTypes = getOfferTypes();
  const destinationTypes = getDestinationTypes();

  console.log(destinationTypes);

  const event = {
    dueDate: generateDate(),
    dateFrom,
    dateTo,
    duration,
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: getArrayRandomElement(TYPES),
    destination: {
      name: getArrayRandomElement(CITIES),
    },
  };

  const offers = offerTypes.get(event.type);
  const destination = destinationTypes.get(event.destination.name);
  event.offer = offers;
  event.destination.description = destination.descriptions;
  event.destination.picture = destination.pictures;
  event.basePrice = offers ? calcPrice(offers) : 0;

  return event;
};

export {createEvent, getOfferTypes, getDestinationTypes};
