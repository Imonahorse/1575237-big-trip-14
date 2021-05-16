class Destination {
  constructor() {
    this._destination = [];
  }

  setDestination(destination) {
    this._destination = destination.slice();
  }

  getDestination() {
    return this._destination;
  }
}

export default Destination;
