/**
 * @typedef {import('./Contact.type.js').Contact} Contact
 * @typedef {import('./Product.type.js').Product} Product
 */

/**
 * Order
 * @typedef {Object} Order
 * @property {Contact} contact The Contact
 * @property {Array.<Product._id>} productsId The Product id Array
 * @property {?string} orderId The Order id
 */

/**
 * Empty Order to make this JS file works for Order type
 * @const
 * @type {Order}
 */
export const EMPTY_ORDER = {};
