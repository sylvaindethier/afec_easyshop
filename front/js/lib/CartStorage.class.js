export default class CartStorage {
  /**
   * The storage key
   * @private
   * @static
   */
  static #key = "cart";

  /**
   * Get storage item
   * @private
   * @returns {string | null} The storage item value
   */
  get #storageItem() {
    return window.localStorage.getItem(CartStorage.#key);
  }

  /**
   * Set storage item
   * @private
   * @param {string} value The value to set to storage item
   */
  set #storageItem(value) {
    window.localStorage.setItem(CartStorage.#key, value);
  }

  /**
   * Get json
   * @private
   * @returns {JSON | null} The json value
   */
  get _json() {
    return JSON.parse(this.#storageItem);
  }

  /**
   * Set json
   * @private
   * @param {JSON} value The value to set to json
   */
  set _json(value) {
    this.#storageItem = JSON.stringify(value);
  }
}
