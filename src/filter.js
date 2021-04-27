import {isEventComing, isEventExpired} from './utils/event.js';

const eventToFilterMap = {
  everything: (events) => events.filter((event) => event.dueDate).length,
  future: (events) => events.filter((event) => isEventComing(event.dueDate)).length,
  past: (events) => events.filter((event) => isEventExpired(event.dueDate)).length,
};

const generateFilter = (events) => {
  return Object.entries(eventToFilterMap).map(([filterName, countEvents]) => {
    return {
      name: filterName,
      count: countEvents(events),
    };
  });
};

export {generateFilter};
