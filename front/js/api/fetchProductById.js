import { productByIdURL } from "./config.js";
import fetchURL from "./fetchURL.js";

/**
 * @typedef {import('./types/Product.type.js').Product} Product
 */

/**
 * Fetch a product by its id from API
 * @param {Product._id} id The product id to fetch from the API
 * @throws {Error} Whenever an error occurs while fetching a product by its id
 * @returns {Promise<Product>} Promise which resolve to the Product
 */
export default function fetchProductById(id) {
  // define Error handlers
  const onResponseError = (response) => {
    const message = `Response Error while fetching product by 'id' "${id}"`;
    console.error("@fetchProductById", message, response);
    throw new Error(message);
  };
  const onError = (error) => {
    const message = `Error while fetching product by 'id' "${id}"`;
    console.error("@fetchProductById", message, error);
    throw new Error(message);
  };

  return fetchURL(productByIdURL(id), { onResponseError, onError });
}
