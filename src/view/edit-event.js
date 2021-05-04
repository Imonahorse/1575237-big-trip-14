import {humanizeEditEventDateFormat, humanizeDateFormat} from '../utils/event.js';
import {getOfferTypes, getDestinationTypes, TYPES} from '../mock/event-data.js';
import SmartView from './Smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createTypesListTemplate = (types, prevTypeState) => {
  return types.map((type) => {

    return `<div class="event__type-item">
                <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type.toLowerCase()} ${prevTypeState === type ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type.toLowerCase()}</label>
            </div>`;
  }).join('');
};
const createPhotosTemplate = (photos) => {
  if (photos === null) {
    return '';
  }

  return photos.map((photo) => {
    return `<img class="event__photo" src=${photo.src} alt=${photo.alt}>`;
  }).join('');
};
const createOffersList = (offers) => {
  return offers.map((item) => {
    return `    <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id=${item.id} type="checkbox" name="event-offer-luggage" checked>
                    <label class="event__offer-label" for=${item.id}>
                    <span class="event__offer-title">${item.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${item.price}</span>
                    </label>
                    </div>`;
  }).join('');
};
const createOffersTemplate = (offers, offersState) => {
  return offersState ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                       ${createOffersList(offers, offersState)}
                    </div>
                  </section>` : '';
};
const createDescriptionTemplate = (pictures, description) => {
  if (description === null) {
    return '';
  }

  return `     <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${createPhotosTemplate(pictures)}
                      </div>
                    </div>
                  </section>`;
};

const createEditEventTemplate = (event) => {
  const {dateFrom, dateTo, id, destination, offer, basePrice, offersState, type, prevTypeState} = event;
  const {name, description, picture} = destination;

  const timeStart = humanizeEditEventDateFormat(dateFrom);
  const timeEnd = humanizeEditEventDateFormat(dateTo);

  return `<li class="trip-events__item" id="${id}">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                                ${createTypesListTemplate(TYPES, prevTypeState)}
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeStart}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeEnd}">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                        ${createOffersTemplate(offer, offersState)}
                        ${createDescriptionTemplate(picture, description)}
                  </section>
                </section>
              </form>
            </li>`;
};

class EditEvent extends SmartView {
  constructor(event) {
    super();
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._data = EditEvent.changeEventToState(event);
    this._offersMap = getOfferTypes();
    this._descriptionsMap = getDestinationTypes();

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerDateTo();
    this._setDatepickerDateFrom();
  }

  getTemplate() {
    return createEditEventTemplate(this._data);
  }

  reset(event) {
    this.updateData(
      EditEvent.changeEventToState(event),
    );
  }

  static changeEventToState(event) {
    return Object.assign({}, event, {
      offersState: event.offer !== null,
      prevTypeState: event.type,
    });
  }

  static changeStateToEvent(data) {
    const newData = Object.assign({}, data);

    if (!newData.offersState) {
      newData.offer = null;
    }

    delete newData.offersState;
    delete newData.prevTypeState;

    return newData;
  }

  _dateToChangeHandler(userDate) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _dateFromChangeHandler(userDate) {
    this.updateData({
      dateFrom: userDate,
      dueDate: humanizeDateFormat(userDate),
    });
  }

  _setDatepickerDateTo() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    if (this._data.dateTo) {
      this._dateToPicker = flatpickr(
        this.getElement().querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y h:i',
          defaultDate: humanizeEditEventDateFormat(this._data.dateTo),
          minDate: humanizeEditEventDateFormat(this._data.dateFrom),
          onChange: this._dateToChangeHandler,
        },
      );
    }
  }

  _setDatepickerDateFrom() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._data.dateFrom) {
      this._dateFromPicker = flatpickr(
        this.getElement().querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y h:i',
          defaultDate: humanizeEditEventDateFormat(this._data.dateFrom),
          onChange: this._dateFromChangeHandler,
        },
      );
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setEditClickHandler(this._callback.editClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this._setDatepickerDateTo();
    this._setDatepickerDateFrom();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('change', this._typeToggleHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationInputHandler);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    const value = evt.target.value;
    const offers = this._offersMap.get(this._data.type);

    this.updateData({
      type: value,
      offer: offers,
      prevTypeState: value,
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const value = evt.target.value;
    const valueCheck = this._descriptionsMap.has(value);

    if (valueCheck) {
      const destination = this._descriptionsMap.get(value);

      this.updateData({
        destination: {
          name: value,
          description: destination.descriptions,
          picture: destination.pictures,
        },
      });
    } else {
      evt.target.setCustomValidity('This name is unavailable');
      evt.target.reportValidity();
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditEvent.changeStateToEvent(this._data));
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick(EditEvent.changeStateToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}

export default EditEvent;
