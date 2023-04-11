import { getURLSearchParam } from "./lib/getURLSearchParam.js";
import { toHTMLElement } from "./lib/toHTMLElement.js";
import { fetchProductById } from "./api.js";
import Cart from "./Cart.class.js";

/**
 * Convert JSON to item HTMLElement
 * @param { JSON } json JSON to convert to item HTMLElement
 * @returns { HTMLElement } The item HTMLElement
 */
function item_JSONtoHTMLElement(json) {
  // get product properties value
  const { name, price, colors, description, imageUrl, altTxt } = json;

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

class CartItemDOM {
  // Get color from the #color-select
  get color() {
    const el = document.querySelector("#color-select");
    return null === el ? null : String(el.value);
  }

  // Get quantity from the #itemQuantity
  get quantity() {
    const el = document.querySelector("#itemQuantity");
    return null === el ? null : parseInt(String(el.value));
  }

  // get JSON
  get JSON() {
    return {
      id: this.id,
      color: this.color,
      quantity: this.quantity,
    };
  }
}

/********************************************/
/***** insert product into the DOM *****/
/********************************************/

// get the id from the URLSearchParams
const id = getURLSearchParam("id", window.location.href);

// fetch product by ID from API
const product = await fetchProductById(id);
console.log("fetchProductById", id, product);

// set document title to product.name
document.title = product.name;

// create item HTMLElement from product
const item_HTMLElement = item_JSONtoHTMLElement(product);
const item_parentHTMLElement = document.querySelector(".item");
// insert item_HTMLElement into item_parentHTMLElement
item_parentHTMLElement.appendChild(item_HTMLElement);

// get cart & item
const cart = new Cart();
const item = new CartItemDOM();
item.id = id;

console.log("cart.items", cart.items);

/*******************************/
/***** #addToCart listener *****/
/*******************************/
function addToCart() {
  const jsonItem = item.JSON;
  const { color, quantity } = jsonItem;

  // do nothing if quantity or color are falsy
  if (!quantity || !color) {
    console.error("addToCart", "nothing to add");
    return;
  }

  // get cart item
  const cartItem = cart.getItem(jsonItem);
  if (cartItem != null) {
    // item in cart, add quantity & update
    console.log(
      "addToCart",
      "cart.getItem",
      "cart.updateItemQuantity",
      jsonItem
    );
    cartItem.quantity += quantity;
    cart.updateItem(cartItem);
  } else {
    // item not in cart, insert it
    console.log("addToCart", "!getItem", "cart.addItem", jsonItem);
    cart.addItem(jsonItem);
  }

  console.log("addToCart", "updated cart.items", cart.items);
}
document.querySelector("#addToCart").addEventListener("click", addToCart);
