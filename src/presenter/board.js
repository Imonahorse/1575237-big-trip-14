import SortingView from '../view/sorting-events.js';
import EventsListView from '../view/events-list.js';
import NewEventView from '../view/new-event.js';
import NoEventView from '../view/no-event.js';
import {render, RenderPosition} from '../utils/render.js';
import EventPresenter from './event.js';

const EMPTY_EVENTS_LIST = 0;

class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._sortComponent = new SortingView();
    this._noEventComponent = new NoEventView();
    this._newEventComponent = new NewEventView();
    this._eventsListComponent = new EventsListView();
  }

  init(boardEvents) {
    this._boardEvents = boardEvents;
    this._renderBoard();
  }

  _renderSorting() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvents() {
    render(this._boardContainer, this._newEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent);
    eventPresenter.init(event);
  }

  _renderEvents() {
    this._boardEvents.map((item) => this._renderEvent(item));
  }

  _renderEventsList() {
    render(this._boardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderNewEvent() {
    render(this._eventsListComponent, this._newEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (this._boardEvents.length === EMPTY_EVENTS_LIST) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();
    this._renderEvents();
    this._renderNewEvent();
    this._renderEventsList();
  }
}

export default Board;
