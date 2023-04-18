import fetchProducts from "./api/fetchProducts.js";
import { buildIdURL } from "./api/config.js";
import toHTMLElement from "./lib/toHTMLElement.js";

/**
 * Convert JSON to item HTMLElement
 * @param { JSON } json JSON to convert to item HTMLElement
 * @returns { HTMLElement } The item HTMLElement
 */
function item_JSONtoHTMLElement(json) {
  // get properties value
  const {
    // id,
    _id,
    name,
    // color,
    colors,
    // quantity,
    price,
    description,
    imageUrl,
    altTxt,
  } = json;

  // get item properties value
  // const { _id, name, description, imageUrl, altTxt } = json;

  const html = `
<a href="./product.html${buildIdURL(_id)}">
  <article>
    <img src="${imageUrl}" alt="${altTxt}">
    <h3 class="productName">${name}</h3>
    <p class="productDescription">${description}</p>
  </article>
</a>
`;
  return toHTMLElement(html);
}

/********************************************/
/***** insert all products into the DOM *****/
/********************************************/

// fetch products from API
const products = await fetchProducts();
console.log('fetchProducts', products);

// create items HTMLElement from products
const items_HTMLElement = products.map(item_JSONtoHTMLElement);
const items_parentHTMLElement = document.querySelector("#items");
// insert products_HTMLElement into items_parentHTMLElement
items_parentHTMLElement.append(...items_HTMLElement);
