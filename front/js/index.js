import { fetchProducts } from "./api.js";
import { toHTMLElement } from "./lib/toHTMLElement.js";

/**
 * Convert JSON product to HTMLElement
 * @param { JSON } productJSON JSON product to convert to HTML string
 * @returns { HTMLElement } The corresponding product HTMLElement
 */
function product_JSONtoHTMLElement(productJSON) {
  // get properties value
  const { _id, name, description, imageUrl, altTxt } = productJSON;

  const html = `
<a href="./product.html?id=${_id}">
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

// create products HTMLElement from JSON products
const products_HTMLElement = products.map(product_JSONtoHTMLElement);

// get products_parentHTMLElement
const products_parentHTMLElement = document.querySelector("#items");
// insert products_HTMLElement into products_parentHTMLElement
products_parentHTMLElement.append(...products_HTMLElement);
