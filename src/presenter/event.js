import EditEventView from '../view/edit-event.js';
import EventView from '../view/event.js';
import {render, replace, RenderPosition, remove} from '../utils/render.js';
import {isEscEvent} from '../utils/common.js';
import {UserAction, UpdateType} from '../utils/constant.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class Event {
  constructor(eventListComponent, changeData, changeMode) {
    this._eventListComponent = eventListComponent;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleSubmitEditClick = this._handleSubmitEditClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevComponent = this._eventComponent;
    const prevEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EditEventView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setEditClickHandler(this._handleCloseEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleSubmitEditClick);

    if (prevComponent === null || prevEditComponent === null) {
      render(this._eventListComponent, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEditComponent);
    }

    remove(prevComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    this._changeMode();
    this._mode = Mode.EDITING;

    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceFormToCard() {
    this._mode = Mode.DEFAULT;

    replace(this._eventComponent, this._eventEditComponent);
  }

  _escKeydownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._closeEventEditForm();
    }
  }

  _closeEventEditForm() {
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _handleEditClick() {
    this._replaceCardToForm();
    document.addEventListener('keydown', this._escKeydownHandler);
  }

  _handleCloseEditClick() {
    this._eventEditComponent.reset(this._event);
    this._closeEventEditForm();
  }

  _handleSubmitEditClick(event) {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      event,
    );
    this._closeEventEditForm();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      Object.assign({}, this._event, {isFavorite: !this._event.isFavorite}),
    );
  }
}

export default Event;

