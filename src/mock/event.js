import {calcPrice, generateDate, generateDateFrom, generateDateTo} from '../utils/event.js';
import {getArrayRandomElement, getRandomInteger, msToTime} from '../utils/common.js';
import {TYPES, CITIES} from '../utils/constant.js';
import {nanoid} from 'nanoid';

const createEvent = (getOfferTypes, getDestinationTypes) => {
  const dueDate = generateDate();
  const dateFrom = generateDateFrom(dueDate);
  const dateTo = generateDateTo(dateFrom);
  const duration = msToTime(dateTo.diff(dateFrom));
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
  };

  const offers = offerTypes.get(event.type);
  const destination = destinationTypes.get(event.destination.name);
  event.offer = offers;
  event.destination.description = destination.descriptions;
  event.destination.picture = destination.pictures;
  event.basePrice = offers ? calcPrice(offers) : 0;

  return event;
};

export {createEvent};