import AbstractView from './abstract.js';
import {humanizeDateFormat} from '../utils/event.js';

const getTotalPrice = (events) => {
  const totalBasePrice = events.reduce(((sum, current) => sum + current.basePrice), 0);
  const totalOffersPrice = events.reduce((sum, current) => {
    let offersCount = 0;
    current.offers.forEach((item) => offersCount += item.price);
    return sum + offersCount;
  }, 0);
  return totalBasePrice + totalOffersPrice;
};
const getDestinationName = (events) => {
  const firstDestinationPoint = events[0].destination.name;
  const lastDestinationPoint = events[events.length - 1].destination.name;

  if (events.length === 1) {
    return firstDestinationPoint;
  }
  if (events.length === 2) {
    return firstDestinationPoint + ' &mdash; ' + lastDestinationPoint;
  }
  if (events.length >= 3) {
    return firstDestinationPoint + ' &mdash; . . . &mdash; ' + lastDestinationPoint;
  }
};
const getDate = (events) => {
  const firstDate = humanizeDateFormat(events[0].dateFrom);
  const lastDate = humanizeDateFormat(events[events.length - 1].dateTo);

  if (events.length === 1) {
    return firstDate;
  }
  if (events.length >= 2) {
    return firstDate + ' &nbsp;&mdash;&nbsp; ' + lastDate;
  }
};

const createRouteInfoTemplate = (events) => {
  const eventsSort = events.slice().sort((a, b) => a.dateTo - b.dateTo);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getDestinationName(eventsSort)}</h1>

              <p class="trip-info__dates">${getDate(eventsSort)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(events)}</span>
            </p>
          </section>`;
};

class RouteInfo extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._events);
  }
}

export default RouteInfo;
