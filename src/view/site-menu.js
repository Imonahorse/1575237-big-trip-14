import AbstractView from './abstract.js';
import {MenuItem} from '../utils/constant.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
             <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-type="${MenuItem.TABLE}">Table</a>
             <a class="trip-tabs__btn" href="#" data-menu-type="${MenuItem.STATISTICS}">Stats</a>
          </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuType);
  }

  setClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
