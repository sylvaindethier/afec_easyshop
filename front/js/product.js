import { getIdURL } from "./api/config.js";
import Cart from "./lib/Cart.class.js";
import Item from "./lib/Item.class.js";
import toHTMLElement from "./lib/toHTMLElement.js";

/**
 * @typedef {import('./api/types/Product.type.js').Product} Product
 */

/**
 * Convert Product to HTMLElement
 * @param {Product} product The Product to convert to HTMLElement
 * @returns {HTMLElement} The HTMLElement
 */
function product_toHTMLElement(product) {
  // get properties value
  const { name, colors, price, description, imageUrl, altTxt } = product;

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
 * Convert Item to HTMLElement
 * @param {Item} item The Item to convert to HTMLElement
 * @returns {Promise<HTMLElement> } Promise which resolves to HTMLElement
 */
async function item_toHTMLElement(item) {
  // get the product from item props
  const { product } = await cart.getItemProps(item);
  // convert product to HTMLElement
  return product_toHTMLElement(product);
}

class ItemDOM extends Item {
  // Get color from #color-select
  get color() {
    const value = document.querySelector("#color-select")?.value;
    return null === value ? null : String(value);
  }
  // Set color
  set color(value) {}

  // Get quantity from #itemQuantity
  get quantity() {
    const value = document.querySelector("#itemQuantity")?.value;
    return null === value ? null : parseInt(String(value));
  }
  // Set quantity
  set quantity(value) {}
}

// get the product id from the URL
const id = getIdURL(window.location.href);
// console.info("@product", "getIdURL", id);

const cart = new Cart();
const item = new ItemDOM({ id });
// console.info("@product", "cart", cart, "item", item);

/***************************************/
/***** insert product into the DOM *****/
/***************************************/

// create item HTMLElement
const item_HTMLElement = await item_toHTMLElement(item);
const item_parentHTMLElement = document.querySelector(".item");
// insert item_HTMLElement into item_parentHTMLElement
item_parentHTMLElement.appendChild(item_HTMLElement);

console.info("@product", "cart", cart, "item", item);

/*******************************/
/***** #addToCart listener *****/
/*******************************/
function addToCart() {
  // console.log("addToCart", "item", item);
  const { color, quantity } = item;
  // do nothing if quantity or color are falsy
  if (!color || !quantity) {
    console.error(
      "@product addToCart: nothing to add: `color` or `quantity` falsy",
      { color, quantity }
    );
    return;
  }

  // get cart item
  const cartItem = cart.getItem({ id, color });
  if (cartItem != null) {
    // item is in cart, add quantity & update
    console.log(
      "@product addToCart",
      "cart.getItem",
      cartItem,
      "cart.updateItem quantity+=",
      quantity
    );
    cartItem.quantity += quantity;
    cart.updateItem(cartItem);
  } else {
    const props = { id, color, quantity };
    // item is not in cart, insert it
    console.log("@product addToCart", "!cart.getItem", "cart.addItem", props);
    cart.addItem(props);
  }

  console.info(
    "@product addToCart",
    "updated cart.items",
    cart.items,
    "cart",
    cart
  );
}
document.querySelector("#addToCart").addEventListener("click", addToCart);
