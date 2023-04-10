import { getURLSearchParam } from "./lib/getURLSearchParam.js";
import { toHTMLElement } from "./lib/toHTMLElement.js";
import { fetchProductById } from "./api.js";
import Cart from "./Cart.class.js";

/**
 * Convert JSON product to HTMLElement
 * @param { JSON } productJSON JSON product to convert to HTML string
 * @returns { HTMLElement } The corresponding product HTMLElement
 */
function product_JSONtoHTMLElement(productJSON) {
  // get properties value
  const { name, price, colors, description, imageUrl, altTxt } = productJSON;

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

class Item {
  // get the id from the URLSearchParams
  get id() {
    return getURLSearchParam("id", window.location.href);
  }

  // get the quantity from the #itemQuantity
  get quantity() {
    const el = document.querySelector("#itemQuantity");
    if (null === el) {
      return null;
    }
    return parseInt(el.value);
  }

  // get the color from the #color-select
  get color() {
    const el = document.querySelector("#color-select");
    if (null === el) {
      return null;
    }
    return el.value;
  }

  get JSON() {
    return {
      id: this.id,
      quantity: this.quantity,
      color: this.color,
    };
  }
}

// get new cart & item
const cart = new Cart();
const item = new Item();

/********************************************/
/***** insert product into the DOM *****/
/********************************************/

// get item id
const id = item.id;

// fetch product by ID from API
const product = await fetchProductById(id);

// create product HTMLElement from JSON product
const product_HTMLElement = product_JSONtoHTMLElement(product);

// set document title to product.name
document.title = product.name;

// get product_parentHTMLElement
const product_parentHTMLElement = document.querySelector(".item");
// insert product_HTMLElement into product_parentHTMLElement
product_parentHTMLElement.appendChild(product_HTMLElement);

/*******************************/
/***** #addToCart listener *****/
/*******************************/
function isSameItem(item1, item2) {
  return (item1.id === item2.id) && (item1.color === item2.color);
}

function addToCart() {
  let jsonItem = item.JSON;

  // do nothing if quantity or color are falsy
  if (!jsonItem.quantity || !jsonItem.color) {
    return;
  }

  // get cart.items
  let items = cart.items;
  let hasSameItem = false;

  // loop through items until same item
  items.forEach((currentItem, index, thisArray) => {
    hasSameItem = isSameItem(currentItem, jsonItem);
    // update quantity if is same item
    if (hasSameItem) {
      currentItem.quantity += jsonItem.quantity;
      thisArray[index] = currentItem;
      return;
    }
  });

  if (!hasSameItem) {
    // same item not in cart, insert it
    items.push(jsonItem);
  }

  // update cart.items
  cart.items = items;
}
document.querySelector("#addToCart").addEventListener("click", addToCart);
