import {isEventComing, isEventExpired} from './event.js';
import {FilterType} from './constant.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event.dateTo),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventComing(event.dateTo)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventExpired(event.dateFrom)),
};

export {filter};
