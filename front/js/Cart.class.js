export default class Cart {
  static key = "cart";
  constructor() {
    // initialize JSON
    if (this.JSON === null) {
      this.JSON = [];
    }
  }

  /**
   * Get the JSON
   * @returns { JSON } The JSON value
   */
  get JSON() {
    return JSON.parse(this.storage);
  }

  /**
   * Set the JSON
   * @param { JSON } value The JSON value
   */
  set JSON(value) {
    this.storage = JSON.stringify(value);
  }

  /**
   * Get storage value
   * @returns { String } The storage value
   */
  get storage() {
    return window.localStorage.getItem(Cart.key);
  }

  /**
   * Set storage value
   * @param { String } value The storage value
   */
  set storage(value) {
    window.localStorage.setItem(Cart.key, value);
  }

  /**
   * Add an item
   * @param { JSON } json The item to add
   */
  add(JSON) {
    let json = this.JSON;
    json.push(JSON);
    this.JSON = json;
  }
}
