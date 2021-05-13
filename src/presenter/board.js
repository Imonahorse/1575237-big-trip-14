import SortingView from '../view/sorting-events.js';
import EventsListView from '../view/events-list.js';
import NoEventView from '../view/no-event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import EventPresenter from './event.js';
import {SortType} from '../utils/common.js';
import dayjs from 'dayjs';
import {UpdateType, UserAction, FilterType} from '../utils/constant.js';
import {filter} from '../utils/filter.js';
import EventNewPresenter from './new-event.js';

const EMPTY_EVENTS_LIST = 0;

class Board {
  constructor(boardContainer, eventsModel, filterModel) {
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;
    this._boardContainer = boardContainer;
    this._eventsModel = eventsModel;
    this._sortComponent = null;
    this._filterModel = filterModel;

    this._noEventComponent = new NoEventView();
    this._eventsListComponent = new EventsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init() {
    this._renderBoard();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.slice().sort((a, b) => b.dueDate - a.dueDate);
      case SortType.TIME:
        return filteredEvents.slice().sort((a, b) => dayjs(b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      case SortType.PRICE:
        return filteredEvents.slice().sort((a, b) => b.basePrice - a.basePrice);
    }

    return filteredEvents;
  }

  createTask() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderSorting() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().map((item) => this._renderEvent(item));
  }

  _clearBoard({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._noEventComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderNoEvents() {
    render(this._boardContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsList() {
    render(this._boardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._getEvents().length === EMPTY_EVENTS_LIST) {
      this._renderNoEvents();
      return;
    }

    this._renderEventsList();
    this._renderSorting();
    this._renderEvents();
  }
}

export default Board;
