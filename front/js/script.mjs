import { host, api } from "./_config.js";
import { convertHTML } from "./_utils.js";

// define `products` endpoint
const productsUrl = `${host}${api}`;

/**
 * Fetch all products from API
 *
 * @param {String} The URL API endpoint that fetch all products
 * @throws {Error} Whenever an error occurs while fetching products
 * @returns {Promise} Promise which resolve to an Array of all products
 */
async function fetchProducts(url = productsUrl) {
  try {
    let response = await fetch(url);
    // get `status` as `code` & `statusText` as `text` from response
    let { status: code, statusText: text } = response;

    // check if response is 200 & OK
    if (!(code === 200 && text == "OK")) {
      // there was an error
      throw new Error("Error while fetching products. Response is NOT OK");
    }

    // now we can handle response data as JSON and return products array
    let products = await response.json();
    console.table(products);
    return products;
  } catch (e) {
    console.log("Error while fetching products", e);
  }
}

/**
 * Build a product HTMLElement
 * 
 * @param {Object} A product object
 * @returns {HTMLElement} The corresponding product HTMLElement
 */
function buildProductElement({ _id, name, description, imageUrl, altTxt }) {
  const html = `
  <a href="./product.html?id=${_id}">
    <article>
      <img src="${imageUrl}" alt="${altTxt}">
      <h3 class="productName">${name}</h3>
      <p class="productDescription">${description}</p>
    </article>
  </a>
  `;
  return convertHTML(html);
}

/**
 * Insert the products from API into the DOM
 * 
 * @param {HTMLElement} The parent container HTMLElement for the products
 * @param {String} The URL API endpoint that fetch all products
 */
async function insertProducts (parentElement, url = productsUrl) {
  const products = await fetchProducts(url);

  // loop through each product of products
  for (const product of products) {
    // build the corresponding HTMLElement and insert into parentElement
    const productElement = buildProductElement(product);
    parentElement.appendChild(productElement);
  }
}

// insert products into #items
const itemsElement = document.querySelector("#items");
insertProducts(itemsElement);
