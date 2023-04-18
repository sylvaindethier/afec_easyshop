import { productURL } from "./config.js";
import fetchApi from "./fetchApi.js";

/**
 * Fetch a product by ID from API
 * @param { String } id The product ID to fetch from the API
 * @throws { Error } Whenever an error occurs while fetching a product by its ID
 * @returns { Promise<JSON, Error> } Promise which resolve to JSON product or reject the response Error
 */
export default function fetchProductById(id) {
  const onResponseError = (response) => {
    throw new Error("Response Error while fetching product by ID", response);
  };
  const onError = (error) => {
    console.error("Error while fetching product by ID", error);
  };

  return fetchApi(productURL(id), { onResponseError, onError });
}
