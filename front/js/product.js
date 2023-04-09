import { getURLSearchParam } from "./lib/getURLSearchParam.js";
import { toHTMLElement } from "./lib/toHTMLElement.js";
import { fetchProductById } from "./api.js";

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

/********************************************/
/***** insert product into the DOM *****/
/********************************************/

// get product ID from URLSearchParams
const id = getURLSearchParam("id", window.location.href);
// fetch product by ID from API
const product = await fetchProductById(id);

// create product HTMLElement from JSON product
const product_HTMLElement = product_JSONtoHTMLElement(product);

// get product_parentHTMLElement
const product_parentHTMLElement = document.querySelector(".item");
// insert product_HTMLElement into product_parentHTMLElement
product_parentHTMLElement.appendChild(product_HTMLElement);
