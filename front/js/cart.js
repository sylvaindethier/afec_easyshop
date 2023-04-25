import Cart from "./lib/Cart.class.js";
import Item from "./lib/Item.class.js";
import Contact from "./lib/Contact.class.js";
import ContactValidator from "./lib/ContactValidator.class.js";
import toHTMLElement from "./lib/toHTMLElement.js";
import fetchOrder from "./api/fetchOrder.js";
import { buildIdURL } from "./api/config.js";

/**
 * @typedef {import('./lib/Item.class.js').Item} Item
 */

// convert price to String
const price_toString = (price) =>
  price?.toFixed(2).toString().replace(".", ",");

/**
 * Convert Item properties to HTMLElement
 * @param {Item} props The Item properties to convert to HTMLElement
 * @returns { HTMLElement } The HTMLElement
 */
function props_toHTMLElement(props) {
  // get properties value
  const { id, color, quantity, product } = props;
  const { name, price, imageUrl, altTxt } = product;

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
        <p>Quantité : </p>
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
 * Convert Item to HTMLElement
 * @param {Item} item The item to convert to HTMLElement
 * @returns {Promise<HTMLElement>} Promise which resolves to HTMLElement
 */
async function item_toHTMLElement(item) {
  // get item properties
  const props = await cart.getItemProps(item);
  // convert item properties to HTMLElement
  return props_toHTMLElement(props);
}

/**
 * Get the closest item HTMLElement
 * @param {HTMLElement} element The HTMLElement to get the closest item HTMLElement
 */
function getCartItemHTMLElement(element) {
  return element.closest(".cart__item");
}

/**
 * Get the matching item from HTMLElement
 * @param {HTMLElement} element The HTMLElement to get the matching item
 * @returns {Item | null} The Item if any
 */
function getCartItem(element) {
  // get `id` & `color` from dataset
  const { id, color } = element.dataset;
  return cart.getItem({ id, color });
}

class CartDOM extends Cart {
  /**
   * Set totalQuantity to the DOM
   * @param {number} value The totalQuantity value to set to the DOM
   */
  set totalQuantity(value) {
    document.querySelector("#totalQuantity").textContent = String(value);
  }

  /**
   * Get totalQuantity
   * @returns {number} The calculated totalQuantity
   */
  get totalQuantity() {
    return super.totalQuantity;
  }

  /**
   * Set totalPrice to the DOM
   * @param {number} value The totalPrice value to set to the DOM
   */
  set totalPrice(value) {
    document.querySelector("#totalPrice").textContent = price_toString(value);
  }

  /**
   * Get totalPrice
   * @returns {number} The calculated totalPrice
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

console.info("@cart", "cart", cart);

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
    throw new Error(
      "Something went wrong. The item matching the HTMLElement was not found."
    );
  }

  // update item quantity from the HTMLElement value
  item.quantity = Number(el.value);
  // update the item
  cart.updateItem(item);
  // finally update the DOM
  cart.updateDOM();

  console.info(
    "@cart changeItemQuantity",
    "updated cart.items",
    cart.items,
    "cart",
    cart
  );
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
    throw new Error(
      "Something went wrong. The item matching the HTMLElement was not found."
    );
  }

  // delete cart item
  cart.deleteItem(item);
  // remove item HTMLElement from the DOM
  itemHTMLElement.remove();
  // finally update the DOM
  cart.updateDOM();

  console.info(
    "@cart deleteItem",
    "updated cart.items",
    cart.items,
    "cart",
    cart
  );
}

// listen to event
document
  .querySelectorAll(".itemQuantity")
  .forEach((el) => el.addEventListener("change", changeItemQuantity));

document
  .querySelectorAll(".deleteItem")
  .forEach((el) => el.addEventListener("click", deleteItem));

/**
 * Contact bound to DOM
 */
class ContactDOM extends Contact {
  /**
   * The DOM fields
   * @private
   */
  #fields;

  /**
   * The DOM selectors for fields
   * @private
   */
  #selectors = {};

  constructor(validator) {
    super(validator);
    // initialize fields name from JSON keys
    const json = JSON.parse(JSON.stringify(this));
    this.#fields = Object.keys(json);

    // build selectors
    this.#fields.forEach((key) => {
      this.#selectors[key] = { value: `#${key}`, error: `#${key}ErrorMsg` };
    });
  }

  getValue(field) {
    const selector = this.#selectors[field].value;
    return document.querySelector(selector).value.toString().trim();
  }

  #setErrorText(field, text) {
    const selector = this.#selectors[field].error;
    document.querySelector(selector).textContent = text;
  }

  showError(field) {
    const explain = this.getExplain(field);
    this.#setErrorText(field, explain);
  }

  clearError(field) {
    this.#setErrorText(field, "");
  }

  /**
   * Validate a field value
   * @param {string} field The field name
   * @returns {boolean} Whether or not hte field value is valid
   */
  isValid(field) {
    // first clear error & delete prop
    this.clearError(field);

    // set property value & validate
    const value = this.getValue(field);
    this[field] = value;
    if (super.isValid(field)) {
      return true;
    }

    console.error("@ContactDOM", value, "for", field, "is not valid");
    this.showError(field);
    // reset property value
    this[field] = "";
    return false;
  }

  /**
   * Validate all fields value
   * @returns {boolean} Whether or not all fields value are valid
   */
  validate() {
    let hasError = false;
    this.#fields.forEach((field) => {
      if (!this.isValid(field)) {
        hasError = true;
      }
    });
    return !hasError;
  }
}

/**
 * ContactValidator with french explain
 */
class ContactValidatorFrenchExplain extends ContactValidator {
  firstName_Explain =
    "Le prénom doit contenir uniquement des lettres, espaces, ou tirets (-)";
  lastName_Explain =
    "Le nom doit contenir uniquement des lettres, espaces, ou tirets (-)";
  address_Explain =
    "L'adresse doit commencer par un chiffre et contenir uniquement des lettres, espaces, ou tirets (-)";
  city_Explain =
    "La ville doit contenir uniquement des lettres, espaces, ou tirets (-)";
  email_Explain = "L'email doit être valide";
}

const contact = new ContactDOM(new ContactValidatorFrenchExplain());

/***************************************/
/***** .cart__order__form listener *****/
/***************************************/
function submitOrder(ev) {
  // prevent default to avoid page refresh
  ev.preventDefault();
  console.info("@cart submitOrder");

  if (!contact.validate()) {
    // do nothing, contact is not valid
    console.error(
      "@cart submitOrder",
      "nothing to submit, contact is not valid"
    );
    return;
  }

  // build products id Array
  const products = cart.itemsArray.map((item) => item.product._id);
  const order = { contact, products };
  console.info("@cart submitOrder", "order", order);
  fetchOrder(order)
    .then((orderResponse) => {
      console.log("@cart submitOrder", "fetchOrder response", orderResponse);
      const { orderId } = orderResponse;
      // redirect to confirmation.html with the orderId
      window.location.href = `confirmation.html${buildIdURL(orderId)}`;
    })
    .catch((error) => {
      console.error("@cart submitOrder", "fetchOrder error", error);
    });
}

document
  .querySelector(".cart__order__form")
  .addEventListener("submit", submitOrder);
