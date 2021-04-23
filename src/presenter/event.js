import EditEventView from '../view/edit-event.js';
import EventView from '../view/event.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {isEscEvent} from '../utils/common';

class Event {
  constructor(eventListComponent) {
    this._eventListComponent = eventListComponent;
    this._eventComponent = null;
    this._eventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  init(event) {
    this._event = event;
    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EditEventView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setEditClickHandler(this._handleCloseEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleCloseEditClick);

    render(this._eventListComponent, this._eventComponent, RenderPosition.BEFOREEND);
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
  }

  _closeEventEditForm() {
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _escKeydownHandler(evt) {
    if (isEscEvent) {
      evt.preventDefault();
      this._closeEventEditForm();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
    document.addEventListener('keydown', this._escKeydownHandler);
  }

  _handleCloseEditClick() {
    this._closeEventEditForm();
  }
}

export default Event;

