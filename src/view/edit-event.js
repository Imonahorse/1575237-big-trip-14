import {humanizeEditEventDateFormat, humanizeDateFormat} from '../utils/event.js';
import {generateTodaysDate} from '../utils/event.js';
import {offersTypes, destinationTypes} from '../mock/data.js';
import {msToTime} from '../utils/common.js';
import {TYPES, CITIES} from '../utils/constant.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const date = generateTodaysDate();
const BLANK_EVENT = {
  dueDate: date,
  dateFrom: date,
  dateTo: date,
  duration: '',
  isFavorite: false,
  type: 'Taxi',
  destination: {
    name: '',
    description: '',
    picture: '',
  },
  offer: [],
  basePrice: 0,
};
const createTypesListTemplate = (types, prevTypeState) => {
  return types.map((type) => {
    return `<div class="event__type-item">
                <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type} ${prevTypeState.toLowerCase() === type.toLowerCase() ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
            </div>`;
  }).join('');
};
const createPhotosTemplate = (photos) => {
  if (!photos || !photos.length) {
    return '';
  }

  return photos.map((photo) => {
    return `<img class="event__photo" src=${photo.src} alt=${photo.alt}>`;
  }).join('');
};
const createOffersList = (type, offers) => {
  const offersFromData = offersTypes.get(type);

  return offersFromData.map((item) => {
    const ifChecked = offers.some((offer) => offer.id === item.id);

    return `    <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id=${item.id} type="checkbox" name=${item.id}
                   ${ifChecked ? 'checked' : ''}>
                    <label class="event__offer-label" for=${item.id}>
                    <span class="event__offer-title">${item.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${item.price}</span>
                    </label>
                    </div>`;
  }).join('');
};
const createOffersTemplate = (type, offers) => {
  return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                       ${createOffersList(type, offers)}
                    </div>
                  </section>`;
};
const createDescriptionTemplate = (pictures, description) => {
  if (!description || !description.length) {
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
const createDataListTemplate = (cities) => {
  return `<datalist id="destination-list-1">
            ${cities.map((city) => `<option value=${city}></option>`).join('')}
                    </datalist>`;
};

const createEditEventTemplate = (event) => {
  const {dateFrom, dateTo, id, destination, offer, basePrice, hasOffersState, type, prevTypeState, hasDescriptionState, hasPicturesState} = event;
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
                        ${createDataListTemplate(CITIES)}
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time event__input--time-start" id="event-start-time-1" type="text" name="event-start-time" value="${timeStart}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time event__input--time-end" id="event-end-time-1" type="text" name="event-end-time" value="${timeEnd}">
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
                        ${createOffersTemplate(type, offer, hasOffersState)}
                        ${createDescriptionTemplate(picture, description, hasDescriptionState, hasPicturesState)}
                  </section>
                </section>
              </form>
            </li>`;
};

class EditEvent extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._data = EditEvent.changeEventToState(event);

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._offerCheckHandler = this._offerCheckHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

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
    if (!event) return event;

    return Object.assign({}, event, {
      prevTypeState: event.type,
    });
  }

  static changeStateToEvent(data) {
    const newData = Object.assign({}, data);
    delete newData.prevTypeState;

    return newData;
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dueDate: humanizeDateFormat(userDate),
      dateFrom: userDate,
      dateTo: this._data.dateTo < userDate ? userDate : this._data.dateTo,
    });
  }

  _setDatepickerDateTo() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    if (this._data.dateTo) {
      this._dateToPicker = flatpickr(
        this.getElement().querySelector('.event__input--time-end'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._data.dateTo.$d,
          minDate: humanizeEditEventDateFormat(this._data.dateFrom),
          onClose: this._dateToChangeHandler,
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
        this.getElement().querySelector('.event__input--time-start'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._data.dateFrom.$d,
          onClose: this._dateFromChangeHandler,
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
    this.getElement().querySelector('.event__available-offers').addEventListener('click', this._offerCheckHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    const activeType = evt.target.value;
    const offers = [];

    this.updateData({
      type: activeType,
      offer: offers,
      prevTypeState: activeType,
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const destinationValue = evt.target.value;
    const valueCheck = destinationTypes.has(destinationValue);

    if (!valueCheck) {
      evt.target.setCustomValidity('Choose another city');
      evt.target.reportValidity();
      return;
    }

    const destinationContent = destinationTypes.get(destinationValue);

    this.updateData({
      destination: {
        name: destinationValue,
        description: destinationContent.descriptions,
        picture: destinationContent.pictures,
      },
    });
  }

  _offerCheckHandler(evt) {
    const offer = evt.target;

    if (offer.tagName !== 'INPUT') {
      return;
    }

    let newOffers = this._data.offer.slice();

    if (offer.checked) {
      const offerMap = offersTypes.get(this._data.type);
      const newOffer = offerMap.filter((item) => item.id === offer.id);
      newOffers.push(...newOffer);
    }

    if (!offer.checked) {
      newOffers = this._data.offer.filter((item) => item.id !== offer.id);
    }

    this.updateData({
      offer: newOffers,
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const price = evt.target;
    const priceValue = parseFloat(price.value);

    if (isNaN(priceValue) || priceValue <= 0) {
      price.setCustomValidity('The price cannot be empty, less than zero, contain letters or special characters');
      price.reportValidity();
      return;
    }

    this.updateData({
      basePrice: priceValue,
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const destinationInput = this.getElement().querySelector('.event__input--destination');

    if (!this._data.destination.name.length) {
      destinationInput.setCustomValidity('Choose city');
      destinationInput.reportValidity();
      return;
    }

    this.updateData({
      duration: msToTime(this._data.dateTo - this._data.dateFrom),
    });

    this._callback.formSubmit(EditEvent.changeStateToEvent(this._data));
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick(EditEvent.changeStateToEvent(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditEvent.changeStateToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
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
