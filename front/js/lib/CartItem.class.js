import fetchProductById from "../api/fetchProductById.js";

export default class CartItem {
  /**
   * Convert item to CartItem
   * @param { JSON | CartItem } item The item to convert to CartItem
   * @returns { CartItem } The item
   */
  static from(item) {
    return item instanceof CartItem ? item : new CartItem(item);
  }

  #product = null;

  /**
   * Construct the instance
   * @alias #set
   */
  constructor(json) {
    // set properties
    this.#set(json);
  }

  /**
   * Set properties
   * @private
   * @param { JSON } json The JSON
   * @param { String } json.id The id
   * @param { String } json.color The color
   * @param { Number } json.quantity The quantity
   * @param { Object } json...product The product
   */
  #set({ id, color, quantity, ...product }) {
    this.id = String(id);
    this.color = String(color);
    this.quantity = Number(quantity);
    this.product = product;
  }

  /**
   * Set json
   * @alias #set
   * @param { JSON } json The JSON
   * @param { String } json.id The id
   * @param { String } json.color The color
   * @param { Number } json.quantity The quantity
   * @param { Object } json...product The product
   */
  set json(json) {
    this.#set(json);
  }

  /**
   * Get properties
   * @private
   * @returns { Promise<JSON, Error> } Promise which resolve to JSON item or reject to Error
   */
  async #get() {
    const { id, color, quantity } = this;
    const product = await this.product;
    const json = {
      id,
      color,
      quantity,
      ...product,
    };

    // set json
    this.#set(json);
    return json;
  }

  /**
   * Get json
   * @alias #get
   * @returns { Promise<JSON, Error> } Promise which resolve to JSON item or reject to Error
   */
  get json() {
    return this.#get();
  }

  /**
   * Fetch the product from API
   * @private
   * @throws { Error } Whenever an error occurs while fetching a product by its ID
   * @returns { Promise<JSON, Error> } Promise which resolve to JSON product or reject to Error
   */
  #fetchProduct() {
    return fetchProductById(this.id);
  }

  /**
   * Get product: fetchProductById once
   * @returns { Promise<JSON, Error> } Promise which resolve to JSON product or reject to Error
   */
  get product() {
    if (null === this.#product) {
      // product doesn't exist, fetch it from API
      this.#product = this.#fetchProduct();
    }
    return this.#product;
  }

  /**
   * Set product
   * @param { JSON } product The JSON product
   */
  set product(product) {
    const isObject = Object === product?.constructor;
    const hasKeys = isObject && Object.keys(product).length > 0;
    if (hasKeys) {
      this.#product = product;
    }
  }

  /**
   * Has product
   * @returns { Boolean } Whether or not the product is defined as JSON Object
   */
  hasProduct() {
    return Object === this.#product?.constructor;
  }
}
