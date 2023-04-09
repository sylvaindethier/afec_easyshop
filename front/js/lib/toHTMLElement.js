/**
 * Convert a HTML string into HTMLElement
 * @param { String } html HTML string to convert to an HTMLElement
 * @returns { HTMLElement } HTMLElement created from the `html` string
 */
export function toHTMLElement(html) {
  // create an empty template
  const template = document.createElement("template");
  // populate w/ the html string, trim to avoid empty space
  template.innerHTML = html.trim();
  // return its content as Node from firstChild
  return template.content.firstChild;
}
