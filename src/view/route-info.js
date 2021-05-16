import AbstractView from './abstract.js';
import {humanizeDateFormat} from '../utils/event.js';

const getTotalPrice = (events) => {
  let totalPrice = 0;

  events.forEach((event) => {
    totalPrice += event.basePrice;
  });

  const offers = [];

  events.forEach((event) => offers.push(...event.offers));
  offers.forEach((event) => {
    totalPrice += event.price;
  });
  return totalPrice;
};

const createRouteInfoTemplate = (events) => {
  const totalPrice = getTotalPrice(events);
  const eventsSort = events.slice().sort((a, b) => a.dateTo - b.dateTo);
  const firstDate = humanizeDateFormat(eventsSort[0].dateFrom);
  const lastDate = humanizeDateFormat(eventsSort[eventsSort.length - 1].dateTo);
  const firstDestinationPoint = eventsSort[0].destination.name;
  const lastDestinationPoint = eventsSort[eventsSort.length - 1].destination.name;

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${firstDestinationPoint} &mdash; . . . &mdash; ${lastDestinationPoint}</h1>

              <p class="trip-info__dates">${firstDate}&nbsp;&mdash;&nbsp;${lastDate}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
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
