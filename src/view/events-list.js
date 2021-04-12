import {createElement} from '../utils.js';

const createEventsListTemplate = () => {
  return `<ul class="trip-events__list">
          </ul>`;
};

class EventsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventsListTemplate();
  }

  getElement() {
    if (!this._element) {
      return this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default EventsList;

