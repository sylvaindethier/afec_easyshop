import { getIdURL } from "./api/config.js";
import Cart from "./lib/Cart.class.js";
import CartItem from "./lib/CartItem.class.js";
import toHTMLElement from "./lib/toHTMLElement.js";

/**
 * Convert JSON to HTMLElement
 * @param { JSON } json JSON to convert to HTMLElement
 * @returns { HTMLElement } The HTMLElement
 */
function json_toHTMLElement(json) {
  // get properties value
  const {
    // id,
    // color,
    // quantity,
    // _id,
    name,
    colors,
    price,
    description,
    imageUrl,
    altTxt,
  } = json;

  // set document title to name
  document.title = name;

  // build html
  const html = `
<article>
  <div class="item__img">
    <img src="${imageUrl}" alt="${altTxt}">
  </div>
  <div class="item__content">
    <div class="item__content__titlePrice">
      <h1 id="title">${name}</h1>
      <p>Prix : <span id="price">${price}</span>€</p>
    </div>

    <div class="item__content__description">
      <p class="item__content__description__title">Description :</p>
      <p id="description">${description}</p>
    </div>

    <div class="item__content__settings">
      <div class="item__content__settings__color">
        <label for="color-select">Choisir une couleur :</label>
        <select name="color-select" id="color-select">
          <option value="">-- SVP, choisissez une couleur --</option>
          ${colors
            .map((color) => `<option value="${color}">${color}</option>`)
            .join("\n")}
        </select>
      </div>

      <div class="item__content__settings__quantity">
        <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
        <input name="itemQuantity" id="itemQuantity" type="number" min="1" max="100" value="0">
      </div>
    </div>

    <div class="item__content__addButton">
      <button id="addToCart">Ajouter au panier</button>
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

class CartItemDOM extends CartItem {
  // Get color from the #color-select
  get color() {
    const value = document.querySelector("#color-select")?.value;
    return null === value ? null : String(value);
  }
  // Set color
  set color(value) {}

  // Get quantity from the #itemQuantity
  get quantity() {
    const value = document.querySelector("#itemQuantity")?.value;
    return null === value ? null : parseInt(String(value));
  }
  // Set quantity
  set quantity(value) {}
}

// get the id from the URL
const id = getIdURL(window.location.href);
// console.log("getIdURL", id);

const cart = new Cart();
const item = new CartItemDOM({ id });
// console.log("cart", cart, "item", item);

/***************************************/
/***** insert product into the DOM *****/
/***************************************/

// create item HTMLElement
const item_HTMLElement = await item_toHTMLElement(item);
const item_parentHTMLElement = document.querySelector(".item");
// insert item_HTMLElement into item_parentHTMLElement
item_parentHTMLElement.appendChild(item_HTMLElement);

console.log("cart", cart, "item", item);

/*******************************/
/***** #addToCart listener *****/
/*******************************/
function addToCart() {
  // console.log("addToCart", "item", item);
  const { color, quantity } = item;
  // do nothing if quantity or color are falsy
  if (!quantity || !color) {
    console.error("addToCart", "nothing to add");
    return;
  }

  // get cart item
  const cartItem = cart.getItem({ id, color });
  if (cartItem != null) {
    // item is in cart, add quantity & update
    console.log(
      "addToCart",
      "cart.getItem",
      cartItem,
      "cart.updateItem quantity+=",
      quantity
    );
    cartItem.quantity += quantity;
    cart.updateItem(cartItem);
  } else {
    const json = { id, color, quantity };
    // item is not in cart, insert it
    console.log("addToCart", "!cart.getItem", "cart.addItem", json);
    cart.addItem(json);
  }

  console.log("addToCart", "updated cart.items", cart.items, "cart", cart);
}
document.querySelector("#addToCart").addEventListener("click", addToCart);
