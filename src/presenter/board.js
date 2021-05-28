import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import NoEventView from '../view/no-event.js';
import {render, remove} from '../utils/render.js';
import EventPresenter from './event.js';
import {
  FilterType,
  UpdateType,
  UserAction,
  SortType,
  RenderPosition,
  State as TaskPresenterViewState,
  OfflineMessage,
  OFFLINE_TITLE
} from '../utils/constant.js';
import {filter} from '../utils/filter.js';
import EventNewPresenter from './new-event.js';
import LoadingView from '../view/loading.js';
import {toast} from '../utils/toast.js';
import {isOnline} from '../utils/common.js';

const EMPTY_EVENTS_LIST = 0;

export default class Board {
  constructor(boardContainer, eventsModel, filterModel, api) {
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;
    this._boardContainer = boardContainer;
    this._eventsModel = eventsModel;
    this._sortComponent = null;
    this._filterModel = filterModel;
    this._isLoading = true;
    this._api = api;

    this._noEventComponent = new NoEventView();
    this._eventsListComponent = new EventsListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();

    if (!isOnline()) {
      toast(OfflineMessage.DISCONNECT);
      document.title += OFFLINE_TITLE;
    }
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._eventsListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent() {
    this._currentSortType = SortType.DAY;
    this._filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filterModel.get();
    const events = this._eventsModel.get();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.slice().sort((a, b) => a.dateTo - b.dateTo);
      case SortType.TIME:
        return filteredEvents.slice().sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      case SortType.PRICE:
        return filteredEvents.slice().sort((a, b) => b.basePrice - a.basePrice);
    }

    return filteredEvents;
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
    this._sortComponent.setTypeChangeHandler(this._handleSortTypeChange);
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
        this._eventPresenter[update.id].setViewState(TaskPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => this._eventsModel.update(updateType, response))
          .catch(() => this._eventPresenter[update.id].setViewState(TaskPresenterViewState.ABORTING));
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => this._eventsModel.add(updateType, response))
          .catch(() => this._eventNewPresenter.setAborting());
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(TaskPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => this._eventsModel.delete(updateType, update))
          .catch(() => this._eventPresenter[update.id].setViewState(TaskPresenterViewState.ABORTING));
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._boardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === EMPTY_EVENTS_LIST) {
      this._renderEventsList();
      this._renderNoEvents();
      return;
    }

    this._renderEventsList();
    this._renderSorting();
    this._renderEvents();
  }
}
