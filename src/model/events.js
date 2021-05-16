import Observer from './observer.js';

class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        dateFrom: event.date_from !== null ? new Date(event.date_from) : event.date_from,
        dateTo: event.date_to !== null ? new Date(event.date_to) : event.date_to,
        basePrice: event.base_price,
        isFavorite: event.is_favorite,
      },
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        'date_from': event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
        'date_to': event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
        'is_favorite': event.isFavorite,
        'base_price': event.basePrice,
      },
    );

    delete adaptedEvent.dateTo;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.basePrice;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}

export default Events;
