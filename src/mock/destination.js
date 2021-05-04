import {getArrayRandomElement, getRandomInteger, getRandomArray} from '../utils/common.js';
import {CITIES} from '../utils/constant.js';

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
const PHOTOS_MIN_LENGTH = 0;
const PHOTOS_MAX_LENGTH = 5;

const createRandomPicturesArray = () => {
  return new Array(getRandomInteger(PHOTOS_MIN_LENGTH, PHOTOS_MAX_LENGTH)).fill().map(() => {
    const image = {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 9)}`,
      alt: getArrayRandomElement(DESCRIPTIONS),
    };
    return image;
  });
};

const getDestinationTypes = () => {
  const destinationTypes = new Map();

  CITIES.forEach((city) => {
    const pictures = Math.random() > 0.6 ? null : createRandomPicturesArray();
    const descriptions = Math.random() > 0.7 ? null : getRandomArray(DESCRIPTIONS);

    destinationTypes.set(city, {descriptions, pictures});
  });
  return destinationTypes;
};

export {getDestinationTypes};
