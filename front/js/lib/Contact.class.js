import ContactValidator from "./ContactValidator.class.js";

export default class Contact {
  /**
   * The validator
   * @private
   */
  #validator;

  firstName = "";
  lastName = "";
  address = "";
  city = "";
  email = "";

  constructor(validator) {
    if (!(validator instanceof ContactValidator)) {
      throw new TypeError("validator must be a ContactValidator");
    }
    this.#validator = validator;
  }

  /**
   * Validate a property value
   * @param {string} prop The property to validate
   * @returns {boolean} Whether or not the property value is valid
   */
  isValid(prop) {
    return this.#validator.isValid(prop, this[prop]);
  }

  /**
   * Get explain message
   * @param {string} prop The property to get the explain message
   * @returns {string} The property explain message
   */
  getExplain(prop) {
    return this.#validator.getExplain(prop);
  }
}

