import Cart from "./lib/Cart.class.js";
import CartItem from "./lib/CartItem.class.js";
import toHTMLElement from "./lib/toHTMLElement.js";

// convert price to String
const price_toString = (price) =>
  price?.toFixed(2).toString().replace(".", ",");

/**
 * Convert JSON to item HTMLElement
 * @param { JSON } json JSON to convert to item HTMLElement
 * @returns { HTMLElement } The item HTMLElement
 */
function json_toHTMLElement(json) {
  // get properties value
  const {
    id,
    // _id,
    name,
    color,
    // colors,
    quantity,
    price,
    // description,
    imageUrl,
    altTxt,
  } = json;

  // build html
  const html = `
<article class="cart__item" data-id="${id}" data-color="${color}">
  <div class="cart__item__img">
    <img src="${imageUrl}" alt="${altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${name}</h2>
      <p>${color}</p>
      <p>${price_toString(price)} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>
`;
  return toHTMLElement(html);
}

/**
 * Convert item to HTMLElement
 * @param { CartItem } item The item to convert to HTMLElement
 * @returns { Promise<HTMLElement, Error> } Promise which resolves to the item HTMLElement or reject to Error
 */
async function item_toHTMLElement(item) {
  return json_toHTMLElement(await cart.getItemJSON(item));
}

/**
 * Get the closest cart item HTMLElement
 * @param { HTMLElement } element The HTMLElement to get the closest cart item HTMLElement
 */
function getCartItemHTMLElement(element) {
  return element.closest('.cart__item');
}

/**
 * Get the matching cart item from HTMLElement
 * @param { HTMLElement } element The HTMLElement to get the matching cart item
 * @returns { CartItem | null } The cart item if any
 */
function getCartItem(element) {
  // get `id` & `color` from dataset
  const { id, color } = element.dataset;
  return cart.getItem({ id, color });
}

class CartDOM extends Cart {
  /**
   * Set totalQuantity to the DOM
   * @param { Number } value The totalQuantity value to set to the DOM
   */
  set totalQuantity(value) {
    document.querySelector("#totalQuantity").innerHTML = String(value);
  }

  /**
   * Get totalQuantity
   * @returns { Number } The calculated totalQuantity
   */
  get totalQuantity() {
    return super.totalQuantity;
  }

  /**
   * Set totalPrice to the DOM
   * @param { Number } value The totalPrice value to set to the DOM
   */
  set totalPrice(value) {
    document.querySelector("#totalPrice").innerHTML = price_toString(value);
  }

  /**
   * Get totalPrice
   * @returns { Number } The calculated totalPrice
   */
  get totalPrice() {
    return super.totalPrice;
  }

  updateDOM() {
    // get & set (update) totalQuantity
    const totalQuantity = this.totalQuantity;
    this.totalQuantity = totalQuantity;

    // get & set (update) totalPrice
    const totalPrice = this.totalPrice;
    this.totalPrice = totalPrice;
  }
}

const cart = new CartDOM();

/**********************************************/
/***** insert all cart items into the DOM *****/
/**********************************************/
// create cartItems HTMLElement
const cartItems_HTMLElement = await Promise.all(
  cart.itemsArray.map(item_toHTMLElement)
);
const cartItems_parentHTMLElement = document.querySelector("#cart__items");
// insert cartItems_HTMLElement into cartItems_parentHTMLElement
cartItems_parentHTMLElement.append(...cartItems_HTMLElement);

console.log("cart", cart);

/************************************/
/***** update cart into the DOM *****/
/************************************/
cart.updateDOM();


/**********************************/
/***** .itemQuantity listener *****/
/**********************************/
function changeItemQuantity(ev) {
  // get the HTMLElement that trigger the event
  const el = ev.target;
  // get the cart item
  const item = getCartItem(getCartItemHTMLElement(el));
  if (null === item) {
    throw new Error("Something went wrong. The item matching the HTMLElement was not found");
  }

  // update item quantity from the HTMLElement value
  item.quantity = Number(el.value);
  // update the item
  cart.updateItem(item);
  // finally update the DOM
  cart.updateDOM();

  console.log("changeItemQuantity", "updated cart.items", cart.items, "cart", cart);
}

/********************************/
/***** .deleteItem listener *****/
/********************************/
function deleteItem(ev) {
  // get the HTMLElement that trigger the event
  const el = ev.target;
  // get the cart item HTMLElement
  const itemHTMLElement = getCartItemHTMLElement(el);
  // get the cart item
  const item = getCartItem(itemHTMLElement);
  if (null === item) {
    throw new Error("Something went wrong. The item matching the HTMLElement was not found");
  }

  // delete cart item
  cart.deleteItem(item);
  // remove item HTMLElement
  itemHTMLElement.remove();
  // finally update the DOM
  cart.updateDOM();

  console.log("deleteItem", "updated cart.items", cart.items, "cart", cart);
}

// listen to event
document
  .querySelectorAll(".itemQuantity")
  .forEach((el) => el.addEventListener("change", changeItemQuantity));

document
  .querySelectorAll(".deleteItem")
  .forEach((el) => el.addEventListener("click", deleteItem));
