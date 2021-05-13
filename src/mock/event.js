import {generateDate, generateDateFrom, generateDateTo} from '../utils/event.js';
import {getArrayRandomElement, getRandomArray, getRandomInteger, msToTime} from '../utils/common.js';
import {TYPES, CITIES} from '../utils/constant.js';
import {nanoid} from 'nanoid';

const createEvent = (getOfferTypes, getDestinationTypes) => {
  const dueDate = generateDate();
  const dateFrom = generateDateFrom(dueDate);
  const dateTo = generateDateTo(dateFrom);
  const duration = msToTime(dateTo - dateFrom);
  const offerTypes = getOfferTypes;
  const destinationTypes = getDestinationTypes;

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
    basePrice: getRandomInteger(0, 1000),
  };

  const offers = offerTypes.get(event.type);
  const destination = destinationTypes.get(event.destination.name);
  event.offer = getRandomArray(offers);
  event.destination.description = destination.descriptions;
  event.destination.picture = destination.pictures;

  return event;
};

export {createEvent};
