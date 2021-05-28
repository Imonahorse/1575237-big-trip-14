import FilterView from '../view/filter.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType, RenderPosition, MenuItem} from '../utils/constant.js';

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getFilters() {
    const events = this._eventsModel.get();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filter[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filter[FilterType.PAST](events).length,
      },
    ];
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.get());
    this._filterComponent.setTypeChangeHandler(this._handleTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  changeMode(menuItem) {
    const actualFilterEvents = this._getFilters().slice().reduce((sum, {type, count}) => ({...sum, [type]: count}), {});

    switch (menuItem) {
      case MenuItem.TABLE:
        this._filterComponent.getInputs().forEach((input) => {
          if (actualFilterEvents[input.value] > 0) {
            input.disabled = false;
            return;
          }
          input.disabled = true;
        });
        break;
      case MenuItem.STATISTICS:
        this._filterComponent.getInputs().forEach((input) => input.disabled = true);
        break;
    }
  }

  _handleModelEvent() {
    this.init();
  }

  _handleTypeChange(filterType) {
    if (this._filterModel.get() === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}
