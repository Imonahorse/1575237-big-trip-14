class Offers {
  constructor() {
    this._offers = 0;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }
}

export default Offers;
