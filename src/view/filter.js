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

class Filter extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filter, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}

export default Filter;
