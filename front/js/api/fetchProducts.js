import { productsURL } from "./config.js";
import fetchApi from "./fetchApi.js";

/**
 * Fetch all products from API
 * @throws { Error } Whenever an error occurs while fetching products
 * @returns { Promise<JSON[], Error> } Promise which resolve to an Array of all JSON products or reject the response Error
 */
export default function fetchProducts() {
  const onResponseError = (response) => {
    throw new Error("Response Error while fetching products", response);
  };
  const onError = (error) => {
    console.error("Error while fetching products", error);
  };

  return fetchApi(productsURL, { onResponseError, onError });
}
