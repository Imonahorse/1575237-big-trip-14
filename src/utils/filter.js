import {isEventComing, isEventExpired} from './event.js';
import {FilterType} from './constant.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event.dueDate),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventComing(event.dueDate)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventExpired(event.dueDate)),
};

export {filter};
