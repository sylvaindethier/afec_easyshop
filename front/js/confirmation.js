import { getIdURL } from "./api/config.js";
import toHTMLElement from "./lib/toHTMLElement.js";

/**
 * @typedef {import('./api/types/Contact.type.js').Contact} Contact
 */

/**
 * Converts Contact to HTMLElement
 * @param {Contact} contact 
 */
function contact_toHTMLElement(contact) {
  // get properties value
  const { firstName, lastName, address, city, email } = contact;
  const html = `
<p>
  Merci <b>${firstName} ${lastName}</b> pour votre commande.
  <br>
  Un email de confirmation a été envoyé à <b>${email}</b>
  <br>
  Vous recevrez votre commande à cette adresse:<br>
  <b>${address}, ${city}</b>
</p>
`;
  return toHTMLElement(html);
}

try {
  // get orderId from URL & show it in DOM
  const id = getIdURL(window.location.href);
  document.querySelector('#orderId').textContent = id;

  // get contact information from storage
  const contact = JSON.parse(window.localStorage.getItem("contact"));

  const contactHTMLElement = contact_toHTMLElement(contact);
  // show contact info into the DOM
  document.querySelector(".confirmation > p").appendChild(contactHTMLElement);
} catch {
  console.error("Order 'id' is missing from the URL");
}
