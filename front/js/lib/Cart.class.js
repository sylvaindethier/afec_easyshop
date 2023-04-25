import CartBag from "./CartBag.class.js";
import Item from "./Item.class.js";

/**
 * @typedef {import('../api/types/Product.type.js').Product} Product
 * @typedef {import('./Item.class.js').Item} Item
 */

export default class Cart extends CartBag {
  /**
   * Set item
   * @param {Item} item The item to set
   */
  set item(item) {
    // make sure item is an Item
    const $item = Item.from(item);
    // console.info("@Cart set item", "item", item, "$item", $item);

    // get the product from item.id
    const product = this._getProduct({ _id: item.id });
    const this_hasProduct = null !== product;

    if ($item.hasProduct()) {
      // update this items product if $item has product
      // console.info(
      //   "@Cart set item",
      //   "$item has product, this.#updateItemsProduct",
      //   $item.product
      // );
      this.#updateItemsProduct($item.product);
    } else if (this_hasProduct) {
      // update item product otherwise if this has product
      // console.info(
      //   "@Cart set item",
      //   "this has product, set $item.product",
      //   product
      // );
      $item.product = product;
    }

    // set this item to $item
    // console.info("@Cart set item", "this._setItem", $item);
    this._setItem($item);

    // set json to items
    this._json = this.items;
  }

  /**
   * Update items product
   * @private
   * @param {Product} product The product to update
   */
  #updateItemsProduct(product) {
    // set product
    this._setProduct(product);

    const { _id: product_id } = product;
    this.itemsArray.forEach((item) => {
      if (item.id !== product_id || item.hasProduct()) {
        // item doesn't match product, skip it
        // console.info("@Cart.#updateItemsProduct", "item doesn't match product", { item, product });

        // item has product, no need to update it
        // console.info("@Cart.#updateItemsProduct", "item has product, no need to update");
        return;
      }

      // console.info("@Cart.#updateItemsProduct", "update item.product from product", { item, product });
      // update cartItem.product from product
      item.product = product;
      // set this item
      this._setItem(item);
    });
  }

  /**
   * Get item properties
   * @param {Item} item The item to get the properties
   * @returns {Promise<Item> } Promise which resolve to Item properties
   */
  async getItemProps(item) {
    // get item props then update this items product
    const props = await item.props;
    this.#updateItemsProduct(item.product);
    return props;
  }

  /**
   * Add item
   * @alias set item
   * @param {Item} item The item to add
   */
  addItem(item) {
    // set item
    this.item = item;
  }

  /**
   * Update item
   * @alias set item
   * @param {Item} item The item to update
   */
  updateItem(item) {
    // set item
    this.item = item;
  }

  /**
   * Delete item
   * @param {Item} item The item to delete
   */
  deleteItem(item) {
    super.deleteItem(item);
    // set json to items
    this._json = this.items;
  }

  /**
   * Get itemsArray, the items as Array
   * @returns { CartItem[] } The items as Array
   */
  get itemsArray() {
    return Object.values(this.items);
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
   * Get totalPrice, the calculated the sum of all items quantity by its price
   * @returns { Number } The sum of all CartItem quantity by its price
   */
  get totalPrice() {
    return this.itemsArray.reduce((total, { quantity, product }) => {
      return total + quantity * product.price;
    }, 0);
  }
}
