import {
  getArrayRandomElement,
  getRandomArray,
  generateDate,
  generateTime,
  getRandomInteger,
  formatMilliseconds,
  humanizeTimeFormat
} from '../utils.js';

const TYPES = ['Check-in', 'Sightseeing', 'Restaurant', 'Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight'];
const CITIES = ['London', 'Paris', 'Moscow', 'Amsterdam', 'Warsaw', 'New-Vasiuky'];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const offers = [
  {
    title: 'Add luggage',
    isChecked: Boolean(getRandomInteger(0, 1)),
    price: 30,
  },
  {
    title: 'Switch to comfort class',
    isChecked: Boolean(getRandomInteger(0, 1)),
    price: 100,
  },
  {
    title: 'Add meal',
    isChecked: Boolean(getRandomInteger(0, 1)),
    price: 15,
  },
  {
    title: 'Choose seats',
    isChecked: Boolean(getRandomInteger(0, 1)),
    price: 5,
  },
  {
    title: 'Travel by train',
    isChecked: Boolean(getRandomInteger(0, 1)),
    price: 40,
  },
];
const photos = [
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
    alt: 'Хорошее фото',
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
    alt: 'Плохое фото',
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
    alt: 'Нормальное фото',
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
    alt: 'Отличное фото',
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
    alt: 'Фото как фото',
  },
];

const createEvent = () => {
  const travelDate = generateDate();
  let travelStartTime = generateTime();
  let travelEndTime = generateTime();
  const totalTravelTime = formatMilliseconds(travelEndTime.diff(travelStartTime));

  if (travelStartTime > travelEndTime) {
    const i = travelStartTime;
    travelStartTime = travelEndTime;
    travelEndTime = i;
  }

  return {
    type: getArrayRandomElement(TYPES),
    city: getArrayRandomElement(CITIES),
    date: {
      travelDate: travelDate,
      travelStartTime: humanizeTimeFormat(travelStartTime),
      travelEndTime: humanizeTimeFormat(travelEndTime),
      totalTravelTime,
    },
    offers: getRandomArray(offers),
    destination: {
      description: getRandomArray(DESCRIPTIONS),
      photo: getRandomArray(photos),
    },
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export {createEvent};
