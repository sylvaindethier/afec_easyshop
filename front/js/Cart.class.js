export default class Cart {
  static key = "cart";
  constructor() {
    // initialize items
    if (this.items === null) {
      this.items = [];
    }
  }

  /**
   * Get items
   * @returns { Array<JSON> } The items of JSON item
   */
  get items() {
    return this._JSON;
  }

  /**
   * Set items
   * @param { Array<JSON> } value The array value to set to items
   */
  set items(value) {
    this._JSON = value;
  }

  /**
   * Get _storage
   * @private
   * @returns { String } The _storage value
   */
  get _storage() {
    return window.localStorage.getItem(Cart.key);
  }

  /**
   * Set _storage
   * @private
   * @param { String } value The value to set to _storage
   */
  set _storage(value) {
    window.localStorage.setItem(Cart.key, value);
  }

  /**
   * Get _JSON
   * @private
   * @returns { JSON } The _JSON value
   */
  get _JSON() {
    return JSON.parse(this._storage);
  }

  /**
   * Set _JSON
   * @private
   * @param { JSON } value The JSON to set to _JSON value
   */
  set _JSON(value) {
    this._storage = JSON.stringify(value);
  }
}
