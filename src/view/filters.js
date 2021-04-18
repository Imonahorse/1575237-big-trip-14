import AbstractView from './abstract.js';

const createFiltersItemTemplate = (filter) => {
  const {name, count} = filter;

  return `<div class="trip-filters__filter">
                  <input id="filter-${name}"
                  class="trip-filters__filter-input  visually-hidden"
                   type="radio"
                   name="trip-filter"
                   value="${name}">
                  <label class="trip-filters__filter-label" for="filter-${name}">${name} ${count}</label>
                </div>`;
};

const createFiltersTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((item) => createFiltersItemTemplate(item)).join('');

  return `<form class="trip-filters" action="#" method="get">
                    ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
};

class Filters extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}

export default Filters;
