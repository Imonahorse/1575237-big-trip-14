import {getArrayRandomElement, getRandomInteger} from '../utils/common.js';
import {TYPES} from '../utils/constant.js';

const OFFERS_TITLE = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train'];
const OFFERS_PRICE = [30, 100, 15, 5, 40];
const OFFERS_MIN_COUNT = 1;
const OFFERS_MAX_COUNT = 5;

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
        id: title.toLowerCase().replace(/ /g, '-') + `-${id += 1}`,
      });
    }

    offerTypes.set(type, offers);
  });

  return offerTypes;
};

export {getOfferTypes};
