import AbstractView from './abstract.js';

const createNoTaskTemplate = () => {
  return '<p class="trip-events__msg">Loading...</p>';
};

class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}

export default Loading;
