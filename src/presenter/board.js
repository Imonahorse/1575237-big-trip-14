import SortingView from '../view/sorting-events.js';
import EventsListView from '../view/events-list.js';
import EditEventView from '../view/edit-event.js';
import EventView from '../view/event.js';
import NewEventView from '../view/new-event.js';
import NoEventView from '../view/no-event.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {isEscEvent} from '../utils/common';

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

    render(this._boardContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSorting() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvents() {
    render(this._boardContainer, this._newEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EditEventView(event);

    const replaceCardToForm = () => {
      replace(eventEditComponent, eventComponent);
    };
    const replaceFormToCard = () => {
      replace(eventComponent, eventEditComponent);
    };
    const closeEventEditForm = () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeydown);
    };
    const onEscKeydown = (evt) => {
      if (isEscEvent) {
        evt.preventDefault();
        closeEventEditForm();
      }
    };

    eventComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeydown);
    });
    eventEditComponent.setEditClickHandler(() => {
      closeEventEditForm();
    });
    eventEditComponent.setFormSubmitHandler(() => {
      closeEventEditForm();
    });

    render(this._eventsListComponent, eventComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderEvents() {
    this._boardEvents.map((item) => this._renderEvent(item));
  }

  _renderNewEvent() {
    render(this._eventsListComponent, this._newEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (this._boardEvents.length === EMPTY_EVENTS_LIST) {
      this._renderNoEvents();
    }

    this._renderSorting();
    this._renderEvents();
    this._renderNewEvent();
  }
}

export default Board;
