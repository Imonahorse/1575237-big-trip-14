import SortingView from '../view/sorting-events.js';
import EventsListView from '../view/events-list.js';
import NewEventView from '../view/new-event.js';
import NoEventView from '../view/no-event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import EventPresenter from './event.js';
import {SortType} from '../utils/common.js';
import dayjs from 'dayjs';
import {UpdateType, UserAction} from '../utils/constant.js';

const EMPTY_EVENTS_LIST = 0;

class Board {
  constructor(boardContainer, eventsModel) {
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;
    this._boardContainer = boardContainer;
    this._eventsModel = eventsModel;
    this._sortComponent = null;

    this._noEventComponent = new NoEventView();
    this._newEventComponent = new NewEventView();
    this._eventsListComponent = new EventsListView();


    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._eventsModel.getEvents().slice().sort((a, b) => b.dueDate - a.dueDate);
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort((a, b) => dayjs(b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort((a, b) => b.basePrice - a.basePrice);
    }

    return this._eventsModel.getEvents();
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
        this._eventsModel.deleteTask(updateType, update);
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

  _renderNewEvent() {
    render(this._eventsListComponent, this._newEventComponent, RenderPosition.AFTERBEGIN);
  }

  _clearEventsList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};
  }

  _clearBoard({resetSortType = false} = {}) {
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
    render(this._boardContainer, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._boardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._getEvents().length === EMPTY_EVENTS_LIST) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();
    this._renderEvents();
    // this._renderNewEvent();
    this._renderEventsList();
  }
}

export default Board;
