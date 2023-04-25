/**
 * Product
 * @typedef {Object} Product
 * @property {!string} _id The id
 * @property {!string} name The name
 * @property {!string[]} colors The colors Array
 * @property {!number} price The price
 * @property {!string} description The description
 * @property {!string} imageUrl The image URL
 * @property {!string} altTxt The alt text
 */

/**
 * Empty Product to make this JS file works for Product type
 * @const
 * @type {Product}
 */
export const EMPTY_PRODUCT = {};

/**
 * Whether or not the value is a Product
 * @param {*} value The value to test against Product
 * @returns {boolean} Whether or not the value is a Product
 */
export function isProduct(value) {
  return Object === value?.constructor;
}
