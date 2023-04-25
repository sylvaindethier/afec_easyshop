import { PRODUCTS_URL } from "./config.js";
import fetchURL from "./fetchURL.js";

/**
 * @typedef {import('./Product.type.js').Product} Product
 */

/**
 * Fetch all products from API
 * @throws {Error} Whenever an error occurs while fetching products
 * @returns {Promise<Product[]>} Promise which resolve to an Array of all Product
 */
export default function fetchProducts() {
  // define Error handlers
  const onResponseError = (response) => {
    const message = "Response Error while fetching products";
    console.error("@fetchProducts", message, response);
    throw new Error(message);
  };
  const onError = (error) => {
    const message = "Error while fetching products";
    console.error("@fetchProducts", message, error);
    throw new Error(message);
  };

  return fetchURL(PRODUCTS_URL, { onResponseError, onError });
}
