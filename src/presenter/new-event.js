import EditEventView from '../view/edit-event.js';
import {nanoid} from 'nanoid';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/constant.js';
import {isEscEvent} from '../utils/common.js';

class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EditEventView();
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({}, event, {id: nanoid()}),
    );

    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default EventNew;
