import fetchProducts from "./api/fetchProducts.js";
import { buildIdURL } from "./api/config.js";
import toHTMLElement from "./lib/toHTMLElement.js";

/**
 * @typedef {import('./Product.type.js').Product} Product
 */

/**
 * Convert a Product to HTMLElement
 * @param {Product} product The product to convert to HTMLElement
 * @returns {HTMLElement} The HTMLElement
 */
function product_toHTMLElement(product) {
  // get properties value
  const {
    _id,
    name,
    description,
    imageUrl,
    altTxt,
  } = product;

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
console.info('@index fetchProducts', products);

// create items HTMLElement from products
const items_HTMLElement = products.map(product_toHTMLElement);
const items_parentHTMLElement = document.querySelector("#items");
// insert items_HTMLElement into items_parentHTMLElement
items_parentHTMLElement.append(...items_HTMLElement);
