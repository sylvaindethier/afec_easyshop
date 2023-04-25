/**
 * @typedef {import('../api/types/Contact.type.js').Contact} Contact
 */

export default class ContactValidator {
  /**
   * The firstName 
   * @private
   */
  #firstName_RegExp = /^[A-Za-z](?:[A-Za-z\s-]){0,}/;
  firstName_Explain = "The first name must starts with a letter and contains letters, blank space, or dash only";

  /**
   * The lastName
   * @private
   */
  #lastName_RegExp = /^[A-Za-z](?:[A-Za-z\s-]){0,}/;
  lastName_Explain = "The last name must starts with a letter and contains letters, blank space, or dash only";

  /**
   * The address
   * @private
   */
  #address_RegExp = /^\d+(?:[A-Za-z\s-])+/;
  address_Explain = "The address must starts with some digits and contains letters, blank space, or dash only";
 
  /**
   * The city
   * @private
   */
  #city_RegExp = /^[A-Za-z](?:[A-Za-z\s-]){0,}/;
  city_Explain = "The city must starts with a letter and contains letters, blank space, or dash only";

  /**
   * The email
   * @private
   * @see https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
   */
  #email_RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  email_Explain = "The email must be a valid email";

  /**
   * Get a property RegExp
   * @private
   * @param {string} prop The property to get the RegExp
   * @returns {RegExp} The RegExp for the property
   */
  #getRegExp(prop) {
    switch (prop) {
      case "firstName":
        return this.#firstName_RegExp;
      case "lastName":
        return this.#lastName_RegExp;
      case "address":
        return this.#address_RegExp;
      case "city":
        return this.#city_RegExp;
      case "email":
        return this.#email_RegExp;
    }
  }

  /**
   * Test a value property
   * @param {string} prop The property to test
   * @param {string} value  The value for the property to test
   * @returns {boolean} Whether or not the value for the property is valid
   */
  isValid(prop, value) {
    return this.#getRegExp(prop).test(value);
  }

  /**
   * Get a property explain message
   * @param {string} prop The property to get the explain message
   * @returns {string} The explain message for the property
   */
  getExplain(prop) {
    const key = `${prop}_Explain`;
    return this[key];
  }
}
