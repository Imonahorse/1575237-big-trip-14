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

const TYPES = ['Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
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
const OFFERS_MAX_COUNT = 5;

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
const getOfferTypes = () => {
  const offerTypes = new Map();

  TYPES.forEach((type) => {
    const offersCount = getRandomInteger(OFFERS_MIN_COUNT, OFFERS_MAX_COUNT);
    const offers = [];

    for (let i = 0; i < offersCount; i++) {
      const title = getArrayRandomElement(OFFERS_TITLE);
      let id = i;

      offers.push({
        title: title,
        price: getArrayRandomElement(OFFERS_PRICE),
        id: title.toLowerCase().replace(/ /g, '-') + `${id += 1}`,
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
  const dueDate = generateDate();
  const dateFrom = generateDateFrom(dueDate);
  const dateTo = generateDateTo(dateFrom);
  const duration = msToTime(dateTo.diff(dateFrom));
  const offerTypes = getOfferTypes();
  const destinationTypes = getDestinationTypes();

  const event = {
    dueDate,
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

export {createEvent, getOfferTypes, getDestinationTypes, TYPES};
