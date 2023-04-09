import { fetchApi } from "./lib/fetchApi.js";

// define host server
export const host = "http://localhost:3000";

// define API endpoint
export const apiURL = `${host}/api/products`;

/**
 * Fetch all products from API
 * @param { ?String } url: URL API endpoint that fetch all products
 * @throws { Error } Whenever an error occurs while fetching products
 * @returns { Promise }
 * @returns { Promise.resolve<JSON[]> } Promise which resolve to an Array of all JSON products
 * @returns { Promise.reject<Error> }
 */
export function fetchProducts(url = apiURL) {
  const onResponseError = (response) => {
    throw new Error("Response Error while fetching products", response);
  };
  const onError = (error) => {
    console.error("Error while fetching products", error);
  };

  return fetchApi(url, { onResponseError, onError });
}

/**
 * Fetch a product by ID from API
 * @param { String } id The product ID to fetch from the API
 * @param { ?String } url The URL API endpoint that fetch a product by its ID
 * @throws { Error } Whenever an error occurs while fetching a product by its ID
 * @returns { Promise }
 * @returns { Promise.resolve<JSON> } Promise which resolve to JSON product
 * @returns { Promise.reject<Error> }
 */
export function fetchProductById(id, url = apiURL) {
  const onResponseError = (response) => {
    throw new Error("Response Error while fetching product by ID", response);
  };
  const onError = (error) => {
    console.error("Error while fetching product by ID", error);
  };

  return fetchApi(`${url}/${id}`, onResponseError, onError);
}
