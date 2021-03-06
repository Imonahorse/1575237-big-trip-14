import {humanizeDateFormat, humanizeTimeFormat} from '../utils/event.js';
import AbstractView from './abstract.js';
import {msToTime} from '../utils/common.js';
import he from 'he';

const createOffersTemplate = (offers) => {
  if (offers === null) {
    return '';
  }

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

const createEventTemplate = (event) => {
  const {dateFrom, dateTo, id, isFavorite, destination, basePrice, offers, type} = event;
  const {name} = destination;

  const date = humanizeDateFormat(dateFrom);
  const timeStart = humanizeTimeFormat(dateFrom);
  const timeEnd = humanizeTimeFormat(dateTo);

  const duration = msToTime(new Date(dateTo) - new Date(dateFrom));

  return `<li class="trip-events__item" id="${id}">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${he.encode(date)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${he.encode(timeStart)}">${he.encode(timeStart)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${he.encode(timeEnd)}">${he.encode(timeEnd)}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                    ${createOffersTemplate(offers)}
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

export default class Event extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._events);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
