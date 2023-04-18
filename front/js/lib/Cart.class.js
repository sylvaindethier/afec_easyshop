import CartItem from "./CartItem.class.js";

class CartStorage {
  static #key = "cart";

  /**
   * Get storage
   * @private
   * @returns { String } The storage
   */
  get #storage() {
    return window.localStorage.getItem(CartStorage.#key);
  }

  /**
   * Set storage
   * @private
   * @param { String } value The value to set to storage
   */
  set #storage(value) {
    window.localStorage.setItem(CartStorage.#key, String(value));
  }

  /**
   * Get json
   * @returns { JSON } The json
   */
  get json() {
    return JSON.parse(this.#storage);
  }

  /**
   * Set json
   * @param { JSON } value The value to set to json
   */
  set json(value) {
    this.#storage = JSON.stringify(value);
  }
}

export default class Cart extends CartStorage {
  /**
   * Get item key
   * @private
   * @param { JSON | CartItem } item The item to get the key
   * @returns { String } The item key
   */
  static #itemKey(item) {
    // build key upon `id` & `color`
    const { id, color } = item;
    // console.log("Cart.#itemKey", { id, color }, item);
    return `${id}__${color}`;
  }

  /**
   * Get product key
   * @private
   * @param { JSON } product The product to get the key
   * @returns { String } The product key
   */
  static #productKey(product) {
    // build key upon `_id`
    const { _id } = product;
    // console.log("Cart.#productKey", { _id }, product);
    return `${_id}`;
  }

  // #items
  #items = {};

  // #products
  #products = {};

  /**
   * Constructor
   */
  constructor() {
    super();

    // get json
    const json = this.json;
    if (null === json) {
      // set json w/ items
      this.json = this.#items;
    } else {
      // initialize items w/ json
      Object.values(json).forEach((item) => {
        this.#setItem(item);
      });
    }
  }

  /**
   * Get item
   * @private
   * @param { JSON | CartItem } item The item to get
   * @returns { CartItem | Null } The item if any
   */
  #getItem(item) {
    const itemKey = Cart.#itemKey(item);
    return this.#items[itemKey] ?? null;
  }

  /**
   * Set item
   * @private
   * @param { JSON | CartItem } item  The item to set
   */
  #setItem(item) {
    const itemKey = Cart.#itemKey(item);
    this.#items[itemKey] = CartItem.from(item);
  }

  /**
   * Delete item
   * @private
   * @param { JSON | CartItem } item The item to delete
   */
  #deleteItem(item) {
    const itemKey = Cart.#itemKey(item);
    delete this.#items[itemKey];
  }

  /**
   * Get product
   * @private
   * @param { JSON } product The product to get
   * @returns { Object | Null } The product if any
   */
  #getProduct(product) {
    const productKey = Cart.#productKey(product);
    return this.#products[productKey] ?? null;
  }

  /**
   * Set product
   * @private
   * @param { JSON } product The product to set
   */
  #setProduct(product) {
    const productKey = Cart.#productKey(product);
    this.#products[productKey] = product;
  }

  /**
   * Get items
   * @returns { Object } The items
   */
  get items() {
    return this.#items;
  }

  /**
   * Set items
   * @param { Object } items The value to set to items
   * @throws { Error } The items can NOT be set
   */
  set items(items) {
    throw new Error("Cart set items Exception");
  }

  /**
   * Get item
   * @alias #getItem
   * @param { JSON | CartItem } item The item to get
   * @returns { CartItem | null } The item if any
   */
  getItem(item) {
    return this.#getItem(item);
  }

  /**
   * Get item
   * @throws { Error } The item can NOT be get
   */
  get item() {
    throw new Error("Cart get item Exception");
  }

  /**
   * Set item
   * @param { JSON | CartItem } item The item to set
   */
  set item(item) {
    const cartItem = CartItem.from(item);
    // console.log("Cart set item", "item", item, "cartItem", cartItem);

    // get the product
    const product = this.#getProduct(item);
    const this_hasProduct = null !== product;
    if (cartItem.hasProduct()) {
      // update items product if cartItem has product
      this.#updateItemsProduct(cartItem.product);
    } else if (this_hasProduct) {
      // update item product otherwise if this has product
      cartItem.product = product;
    }

    // set item to cartItem
    // console.log("Cart set item", "this.#setItem", cartItem);
    this.#setItem(cartItem);

    // set json to items
    this.json = this.#items;
  }

  /**
   * Update items product
   * @private
   * @param { JSON } product The product to update items from
   */
  #updateItemsProduct(product) {
    // set product
    this.#setProduct(product);

    const { _id: product_id } = product;
    this.itemsArray.forEach((item) => {
      if (item.id !== product_id || item.hasProduct()) {
        // item doesn't match product, skip item
        // item has product, no need to update it
        return;
      }

      // update item.product from product
      item.product = product;
      // set item
      this.#setItem(item);
    });
  }

  /**
   * Add item
   * @alias set item
   * @param { JSON | CartItem } item The item to add
   */
  addItem(item) {
    // set item
    this.item = item;
  }

  /**
   * Update item
   * @alias set item
   * @param { JSON | CartItem } item The item to update
   */
  updateItem(item) {
    // set item
    this.item = item;
  }

  /**
   * Delete item
   * @alias #deleteItem
   * @param { JSON | CartItem } item The item to delete
   */
  deleteItem(item) {
    this.#deleteItem(item);
  }

  /**
   * Get JSON item
   * @param { CartItem } item The item to get the JSON
   * @returns { Promise<JSON, Error> } Promise which resolve to the item JSON or reject to Error
   */
  async getItemJSON(item) {
    // get JSON item & update items product
    const json = await item.json;
    this.#updateItemsProduct(item.product);
    return json;
  }

  /**
   * Get itemsArray, the items as Array
   * @returns { CartItem[] } The items as Array
   */
  get itemsArray() {
    return Object.values(this.items);
  }

  /**
   * Set itemsArray
   * @param { CartItem[] } itemsArray The value to set to itemsArray
   * @throws { Error } The itemsArray value can NOT be set
   */
  set itemsArray(itemsArray) {
    throw new Error("Cart set itemsArray Exception");
  }

  /**
   * Get totalQuantity, the calculated the sum of all items quantity
   * @returns { Number } The sum of all CartItem quantity
   */
  get totalQuantity() {
    return this.itemsArray.reduce((total, { quantity }) => {
      return total + quantity;
    }, 0);
  }

  /**
   * Set totalQuantity
   * @param { Number } value Tha value to set to totalQuantity
   * @throws { Error } The totalQuantity can NOT be set
   */
  set totalQuantity(value) {
    throw new Error("Cart set totalQuantity Exception");
  }

  /**
   * Get totalPrice, the calculated the sum of all items quantity by its price
   * @returns { Number } The sum of all CartItem quantity by its price
   */
  get totalPrice() {
    return this.itemsArray.reduce((total, { quantity, product }) => {
      return total + (quantity * product.price);
    }, 0);
  }

  /**
   * Set totalPrice
   * @param { Number } value Tha value to set to totalPrice
   * @throws { Error } The totalPrice can NOT be set
   */
  set totalPrice(value) {
    throw new Error("Cart set totalPrice Exception");
  }
}
