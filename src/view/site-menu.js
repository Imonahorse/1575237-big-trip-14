import AbstractView from './abstract.js';
import {MenuItem} from '../utils/constant.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
             <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-type="${MenuItem.TABLE}">Table</a>
             <a class="trip-tabs__btn" href="#" data-type="${MenuItem.STATISTICS}">Stats</a>
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

  changeMode(menuItem) {
    const menuItems = this.getElement().querySelectorAll('.trip-tabs__btn');

    menuItems.forEach((item) => {
      if (item.dataset.type === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  }

  setClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  _clickHandler(evt) {
    if (evt.target.classList.contains('trip-tabs__btn--active')) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.type);
  }
}
