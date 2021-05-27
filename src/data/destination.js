export default class Destination {
  constructor() {
    this._destination = [];
  }

  set(destination) {
    this._destination = destination.slice();
  }

  get() {
    return this._destination;
  }
}
