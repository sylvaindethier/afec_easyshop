/**
 * Convert a HTML string into HTMLElement
 * @param {String} The HTML string to convert
 * @returns {HTMLElement} The HTMLElement
 */
export function convertHTML(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
