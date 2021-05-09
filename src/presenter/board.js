import SortingView from '../view/sorting-events.js';
import EventsListView from '../view/events-list.js';
import NewEventView from '../view/new-event.js';
import NoEventView from '../view/no-event.js';
import {render, RenderPosition} from '../utils/render.js';
import EventPresenter from './event.js';
import {updateItem, SortType} from '../utils/common.js';
import dayjs from 'dayjs';

const EMPTY_EVENTS_LIST = 0;

class Board {
  constructor(boardContainer, eventsModel) {
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;
    this._boardContainer = boardContainer;
    this._eventsModel = eventsModel;

    this._sortComponent = new SortingView();
    this._noEventComponent = new NoEventView();
    this._newEventComponent = new NewEventView();
    this._eventsListComponent = new EventsListView();

    this._handleEventDataChange = this._handleEventDataChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardEvents) {
    this._boardEvents = boardEvents;
    this._sourcedBoardEvents = boardEvents;
    this._renderBoard();
  }

  _getEvents() {
    return this._eventsModel.getEvents();
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._boardEvents.sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.TIME:
        this._boardEvents.sort((a, b) => dayjs(b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
        break;
      case SortType.PRICE:
        this._boardEvents.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        this._boardEvents = this._sourcedBoardEvents;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEventsList();
    this._renderEvents();
  }

  _renderSorting() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventDataChange(updatedEvent) {
    this._boardEvents = updateItem(this._boardEvents, updatedEvent);
    this._sourcedBoardEvents = updateItem(this._sourcedBoardEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleEventDataChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._boardEvents.map((item) => this._renderEvent(item));
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

  _renderNoEvents() {
    render(this._boardContainer, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._boardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._boardEvents.length === EMPTY_EVENTS_LIST) {
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
