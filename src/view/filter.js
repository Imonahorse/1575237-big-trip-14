import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count, type} = filter;

  return `<div class="trip-filters__filter">
                  <input
                  id="filter-${name}"
                  class="trip-filters__filter-input  visually-hidden"
                   type="radio"
                   name="trip-filter"
                   ${type === currentFilterType ? 'checked' : ''}
                   ${count === 0 ? 'disabled' : ''}
                   value="${type}">
                  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
                </div>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((item) => createFilterItemTemplate(item, currentFilterType)).join('');

  return `<form class="trip-filters" action="#" method="get">
                    ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
};

export default class Filter extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filter, this._currentFilterType);
  }

  getInputs() {
    return this.getElement().querySelectorAll('input');
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._typeChangeHandler);
  }
}
