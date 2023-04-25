/**
 * The API host
 * @private
 * @const
 * @type {string}
 */
const HOST = "http://localhost:3000";

/**
 * The API URL endpoint
 * @private
 * @const
 * @type {string}
 */
const API_URL = `${HOST}/api/products`;

/**
 * The API URL for all Product
 * @const
 * @type {string}
 */
export const PRODUCTS_URL = `${API_URL}/`;

/**
 * The API URL for a Product by its id
 * @param {string} id The product id
 * @returns {string} The API URL for a Product
 */
export function productByIdURL(id) {
  return `${API_URL}/${id}`;
}

/**
 * The API URL for an Order
 * @const
 * @type {string}
 */
export const ORDER_URL = `${API_URL}/order`;

/**
 * Get a URLSearchParams from an URL
 * @private
 * @param {string} name The name of the URLSearchParams to get
 * @param {string | URL} [url=window.location.href] The URL from which to get the URLSearchParams
 * @throws {Error} Whenever the name is missing from the URLSearchParams
 * @returns {string} The value of the URLSearchParams
 */
function getURLSearchParam(name, url = window.location.href) {
  // url hast to be an instance of URL
  if (!(url instanceof URL)) {
    url = new URL(url);
  }

  // get URLSearchParams
  const searchParams = url.searchParams;
  // check if URLSSearchParams has name
  if (!searchParams.has(name)) {
    const message = `Missing "${name}" from URLSearchParams`;
    console.error("@getURLSearchParam", message, { url, name });
    throw new Error(message);
  }

  // return its value
  return searchParams.get(name);
}

/**
 * Get "id" from URL
 * @param {string | URL} [url=window.location.href] The URL to get the "id"
 * @throws {Error} Whenever the "id" is missing from the URL
 * @returns {string} The value for the "id"
 */
export function getIdURL(url = window.location.href) {
  return getURLSearchParam("id", url);
}

/**
 * Build URL from "id"
 * @param {string} id The "id" from which to build URL
 * @returns {string} The URL for the "id"
 */
export function buildIdURL(id) {
  const searchParams = new URLSearchParams({ id });
  return `?${searchParams.toString()}`;
}
