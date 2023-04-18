import getURLSearchParam from "./getURLSearchParam.js";

// define host server
const host = "http://localhost:3000";

// define API endpoints
export const apiURL = `${host}/api/products`;

export const productsURL = `${apiURL}/`;

export const productURL = (id) => `${apiURL}/${id}`;

export const orderURL = `${apiURL}/order`;

// get the id from the URL
export function getIdURL(url = window.location.href) {
  return getURLSearchParam("id", url);
}

// build the id URL
export function buildIdURL(id) {
  const searchParams = new URLSearchParams({ id });
  return `?${searchParams.toString()}`;
}
