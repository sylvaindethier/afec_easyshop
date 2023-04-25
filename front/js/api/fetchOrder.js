import { ORDER_URL } from "./config.js";
import fetchURL from "./fetchURL.js";

/**
 * @typedef {import('./types/Order.type.js').Order} Order
 * @typedef {import('./types/Contact.type.js').Contact} Contact
 * @typedef {import('./types/Product.type.js').Product} Product
 */

/**
 * Fetch POST order to API
 * @param {Order} order The order
 * @param {Contact} order.contact The Contact
 * @param {Product._id[]} order.products The Array of products id
 * @throws {Error} Whenever an error occurs while posting order
 * @returns {Promise<Order> } Promise which resolve to the Order
 */
export default function fetchOrder(order) {
  const onResponseError = (response) => {
    throw new Error("Response Error while fetching POST order", response);
  };
  const onError = (error) => {
    console.error("Error while fetching POST order", error);
  };

  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(order),
  };

  return fetchURL(ORDER_URL, { onResponseError, onError, ...init });
}
