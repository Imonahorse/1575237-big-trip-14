import EditEventView from '../view/edit-event.js';
import EventView from '../view/event.js';
import {isDatesEqual, isPriceEqual} from '../utils/event.js';
import {render, replace, remove} from '../utils/render.js';
import {isEscEvent, isOnline} from '../utils/common.js';
import {UserAction, UpdateType, RenderPosition, State, OfflineMessage, Mode} from '../utils/constant.js';
import {toast} from '../utils/toast.js';

export default class Event {
  constructor(eventListComponent, changeData, changeMode) {
    this._eventListComponent = eventListComponent;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleSubmitEditClick = this._handleSubmitEditClick.bind(this);
    this._handleDeleteEditClick = this._handleDeleteEditClick.bind(this);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
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
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteEditClick);

    if (prevComponent === null || prevEditComponent === null) {
      render(this._eventListComponent, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEditComponent);
      this._mode = Mode.DEFAULT;
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
    this._eventEditComponent.reset(this._event);
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
    if (!isOnline()) {
      toast(OfflineMessage.EDIT_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    this._replaceCardToForm();
    document.addEventListener('keydown', this._escKeydownHandler);
  }

  _handleCloseEditClick() {
    this._eventEditComponent.reset(this._event);
    this._closeEventEditForm();
  }

  _handleSubmitEditClick(event) {
    if (!isOnline()) {
      toast(OfflineMessage.SAVE_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    const isMinorUpdate = !isDatesEqual(this._event.dateTo, event.dateTo) || !isPriceEqual(this._event.basePrice, event.basePrice);

    this._changeData(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      event,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      Object.assign({}, this._event, {isFavorite: !this._event.isFavorite}),
    );
  }

  _handleDeleteEditClick(event) {
    if (!isOnline()) {
      toast(OfflineMessage.DELETE_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MAJOR,
      event,
    );
  }
}
