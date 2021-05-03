import Abstract from './abstract.js';

class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    Object.assign({}, this._data, update);
    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}

export default Smart;