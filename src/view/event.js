import {humanizeTimeFormat, humanizeDateFormat, createElement} from '../utils.js';

const createOfferTemplate = (offers) => {
  return offers.map((item) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </li>`;
  }).join('');
};
const addToFavourites = (boolean) => {
  return (boolean) ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
};
const calcPrice = (offers) => {
  let price = 0;
  offers.forEach((item) => price += item.price);
  return price;
};

const createEventTemplate = (events) => {
  const {event, destination, offer} = events;
  const {name} = destination;
  const {type, offers} = offer;
  const {date, dateFrom, dateTo, duration, id, isFavorite} = event;

  const timeStart = humanizeTimeFormat(dateFrom);
  const timeEnd = humanizeTimeFormat(dateTo);
  const dueDate = humanizeDateFormat(date);

  return `<li class="trip-events__item" id="${id}">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${dueDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${timeStart}">${timeStart}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${timeEnd}">${timeEnd}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${calcPrice(offers)}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                    ${createOfferTemplate(offers)}
                </ul>
                <button class="${addToFavourites(isFavorite)}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688
                    9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

class Event {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Event;
