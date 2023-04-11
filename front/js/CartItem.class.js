export default class CartItem {
  /**
   * Convert item to CartItem
   * @param { JSON | CartItem } item The item to convert to CartItem
   */
  static from(item) {
    return item instanceof CartItem ? item : new CartItem(item);
  }

  /**
   * Construct
   * @param { JSON } JSON
   */
  constructor({ id, color, quantity }) {
    this.id = String(id);
    this.color = String(color);
    this.quantity = Number(quantity);
  }
}
