import AbstractView from './abstract.js';

const createNoTaskTemplate = () => {
  return`<p class="trip-events__msg">
            Click New Event to create your first point
          </p>`;
};

class NoEvent extends AbstractView{
  getTemplate() {
    return createNoTaskTemplate();
  }
}

export default NoEvent;

