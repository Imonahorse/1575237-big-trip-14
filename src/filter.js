import {isEventComing, isEventExpired} from './utils.js';

const eventToFilterMap = {
  everything: (events) => events.filter((event) => event.date.travelDate).length,
  future: (events) => events.filter((event) => isEventComing(event.date.travelDate)).length,
  past: (events) => events.filter((event) => isEventExpired(event.date.travelDate)).length,
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
