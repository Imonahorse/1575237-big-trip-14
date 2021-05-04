import {createEvent} from './event.js';
import {getOfferTypes} from './offer.js';
import {getDestinationTypes} from './destination.js';

const EVENTS_COUNT = 15;

const offersTypes = getOfferTypes();
const destinationTypes = getDestinationTypes();
const data = new Array(EVENTS_COUNT).fill().map(() => createEvent(offersTypes, destinationTypes));

export {data, offersTypes, destinationTypes};
