import fetchProductById from "../api/fetchProductById.js";
import { isProduct } from "../api/types/Product.type.js";

/**
 * @typedef {import('../api/types/Product.type.js').Product} Product
 */

/**
 * Item
 * @typedef {Object} Item
 * @property {!String} id The id
 * @property {?String} color The color
 * @property {?Number} quantity The quantity
 * @property {?Product} product The product
 */

export default class Item {
  /**
   * Convert to Item instance
   * @param {Item} item The item to convert to Item
   * @returns {Item} The Item instance
   */
  static from(item) {
    return item instanceof Item ? item : new Item(item);
  }

  /**
   * Construct the instance
   * @param {Item} item The item properties
   */
  constructor(item) {
    // set properties from item
    this.props = item;
  }

  /**
   * Set properties
   * @param {Item} item The item properties
   */
  set props({ id, color, quantity, product }) {
    this.id = String(id);
    this.color = String(color);
    this.quantity = Number(quantity);
    this.product = product;
  }

  /**
   * Get properties
   * @alias #props
   * @returns {Promise<Item>} Promise which resolve to Item properties
   */
  get props() {
    return this.#props();
  }

  /**
   * Get properties
   * @private
   * @returns {Promise<Item>} Promise which resolve to Item properties
   */
  async #props() {
    const { id, color, quantity } = this;
    const product = await this.product;
    const props = {
      id,
      color,
      quantity,
      product,
    };
    // console.info("@Item.#props", props);

    // update properties
    this.props = props;
    return props;
  }

  #product = null;

  /**
   * Get product: fetchProductById once
   * @throws {Error} Whenever an error occurs while fetching the product
   * @returns {Promise<Product>} Promise which resolve to Product
   * @returns {Product} The Product when resolved
   */
  get product() {
    if (null === this.#product) {
      // product doesn't exist, fetch it from API by its id
      this.#product = fetchProductById(this.id);
    }
    return this.#product;
  }

  /**
   * Set product
   * @param {Product} product The Product to set
   */
  set product(product) {
    if (isProduct(product)) {
      this.#product = product;
    }
  }

  /**
   * Has product
   * @returns {boolean} Whether or not it has Product
   */
  hasProduct() {
    return isProduct(this.#product);
  }
}
