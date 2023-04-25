import CartStorage from "./CartStorage.class.js";
import Item from "./Item.class.js";

/**
 * @typedef {import('./Item.class.js').Item} Item
 */

/**
 * ItemKeyProps
 * @typedef {Object} ItemKeyProps
 * @property {!string} id The Item id
 * @property {!string} color The Item color
 * 
 * ItemKey
 * @typedef {string} ItemKey
 * 
 * ItemEntry
 * @typedef {Object.<ItemKey, Item>} ItemEntry
 */

/**
 * ProductKeyProps
 * @typedef {Object} ProductKeyProps
 * @property {!string} _id The Product id
 * 
 * ProductKey
 * @typedef {string} ProductKey
 * 
 * ProductEntry
 * @typedef { Object.<ProductKey, Product> } ProductEntry
 */

export default class CartBag extends CartStorage {
  /**
   * Get item key
   * @private
   * @param {ItemKeyProps} key The Item key properties
   * @returns { ItemKey } The Item key
   */
  static #itemKey({ id, color }) {
    // console.info("@CartBag.#itemKey", { id, color });
    if (!id || !color) {
      const message = "Can not build itemKey: `id` or `color` falsy";
      console.error("@CartBag.#itemKey", message, { id, color });
      throw new Error(message);
    }
    return `${id}__${color}`;
  }

  /**
   * Get product key
   * @private
   * @param {ProductKeyProps} key The Product key properties
   * @returns {ProductKey} The Product key
   */
  static #productKey({ _id }) {
    // console.info("CartBag.#productKey", { _id });
    if (!_id) {
      const message = "Can not build productKey: `_id` falsy";
      console.error("CartBag.#productKey", message, { _id });
      throw new Error(message);
    }
    return `${_id}`;
  }

  /**
   * ItemEntry holder
   * @private {...ItemEntry}
   */
  #items = {};

  /**
   * Get items
   * @returns {...ItemEntry} The items
   */
  get items() {
    return this.#items;
  }

  /**
   * ProductEntry holder
   * @private {...ProductEntry}
   */
  #products = {};

  /**
   * Constructor
   */
  constructor() {
    super();

    // get json
    const json = this._json;
    if (null === json) {
      // set json w/ items
      this._json = this.#items;
    } else {
      // initialize items w/ json
      Object.values(json).forEach((item) => {
        this._setItem(item);
      });
    }
  }

  /**
   * Set item
   * @private
   * @param {Item} item  The item to set
   */
  _setItem(item) {
    const itemKey = CartBag.#itemKey(item);
    this.#items[itemKey] = Item.from(item);
  }

  /**
   * Get item
   * @param {Item} item The item to get
   * @returns {Item | null} The item if any
   */
  getItem(item) {
    const itemKey = CartBag.#itemKey(item);
    return this.#items[itemKey] ?? null;
  }

  /**
   * Delete item
   * @param {Item} item The item to delete
   */
  deleteItem(item) {
    const itemKey = CartBag.#itemKey(item);
    delete this.#items[itemKey];
  }

  /**
   * Get product
   * @private
   * @param {ProductKeyProps} product The product to get
   * @returns {Product | null} The product if any
   */
  _getProduct(product) {
    const productKey = CartBag.#productKey(product);
    return this.#products[productKey] ?? null;
  }

  /**
   * Set product
   * @private
   * @param {Product} product The product to set
   */
  _setProduct(product) {
    const productKey = CartBag.#productKey(product);
    this.#products[productKey] = product;
  }
}
