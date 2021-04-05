import {humanizeTimeFormat, humanizeDateFormat} from '../utils.js';

const createEventTemplate = (events) => {
  const {event, destination, offer} = events;
  const {name} = destination;
  const {type, offers} = offer;
  const {date, date_from, date_to, duration, id, is_favorite} = event;

  const dateFrom = humanizeTimeFormat(date_from);
  const dateTo = humanizeTimeFormat(date_to);
  const dueDate = humanizeDateFormat(date);

  const createOfferTemplate = () => {
    return offers.map((item) => {
      return `<li class="event__offer">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </li>`;
    }).join('');
  };
  const isFavorite = () => {
    return (is_favorite) ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
  };
  const calcPrice = () => {
    let price = 0;
    offers.forEach((item) => price += item.price);
    return price;
  };

  return `<li class="trip-events__item" id="${id}">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${dueDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${dateFrom}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${dateTo}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${calcPrice()}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                    ${createOfferTemplate()}
                </ul>
                <button class="${isFavorite()}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export {createEventTemplate};
