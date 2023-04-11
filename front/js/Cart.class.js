import CartItem from "./CartItem.class.js";

class CartStorage {
  static key = "cart";

  /**
   * Get storage
   * @private
   * @returns { String } The storage
   */
  get storage() {
    return window.localStorage.getItem(CartStorage.key);
  }

  /**
   * Set storage
   * @private
   * @param { String } value The value to set to storage
   */
  set storage(value) {
    window.localStorage.setItem(CartStorage.key, value.toString());
  }

  /**
   * Get JSON
   * @private
   * @returns { JSON } The JSON
   */
  get JSON() {
    return JSON.parse(this.storage);
  }
  /**
   * @alias get JSON
   */
  toJSON() {
    return this.JSON;
  }

  /**
   * Set JSON
   * @private
   * @param { JSON } value The value to set to JSON
   */
  set JSON(value) {
    this.storage = JSON.stringify(value);
  }
  /**
   * @alias set JSON
   */
  fromJSON(value) {
    this.JSON = value;
  }
}

export default class Cart extends CartStorage {
  /**
   * Get an item key
   * @param { JSON | CartItem } item The item to get the key
   * @returns { String } The item key
   */
  static itemKey(item) {
    // build key upon `id` & `color`
    const { id, color } = item;
    return `${id}__${color}`;
  }

  constructor() {
    super();
    // initialize items
    if (this.items === null) {
      this.JSON = {};
    }
  }

  /**
   * Get items
   * @returns { Object } The items
   */
  get items() {
    return this.JSON;
  }

  /**
   * Set items
   * @param { Object } value The value to set to items
   * @throws { Error } The items value can NOT be set
   */
  set items(value) {
    throw new Error("Cart set items Exception");
  }

  /**
   * Get itemsArray
   * @returns { Array<CartItem> } The items as Array
   */
  get itemsArray() {
    return Object.values(this.items);
  }

  /**
   * Set itemsArray
   * @param { Array<CartItem> } value The value to set to itemsArray
   * @throws { Error } The itemsArray value can NOT be set
   */
  set itemsArray(value) {
    throw new Error("Cart set itemsArray Exception");
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
   * @param { JSON | CartItem } value The item to set
   */
  set item(item) {
    const cartItem = CartItem.from(item);
    // get items
    const items = this.items;
    // set cartItem
    items[Cart.itemKey(cartItem)] = cartItem;
    // update JSON
    this.JSON = items;
  }

  /**
   * Get item
   * @param { JSON | CartItem } value The item to get
   * @returns { CartItem | Null } The item if any
   */
  getItem(item) {
    return this.items[Cart.itemKey(item)];
  }

  /**
   * Add item
   * @alias set items
   * @param { JSON | CartItem } item The item to add
   */
  addItem(item) {
    // set item
    this.item = item;
  }

  /**
   * Update item
   * @alias set items
   * @param { JSON | CartItem } item The item to update
   */
  updateItem(item) {
    // set item
    this.item = item;
  }

  /**
   * Get totalQuantity, the calculated the sum of all quantity
   * @returns { Number } The sum all CartItem quantity
   */
  get totalQuantity() {
    return this.itemsArray.reduce((total, { quantity }) => {
      return total + quantity;
    }, 0);
  }

  /**
   * Set totalQuantity
   * @param { * }
   * @throws { Error } The totalQuantity can NOT be set
   */
  set totalQuantity(value) {
    throw new Error("Cart set totalQuantity Exception");
  }
}
