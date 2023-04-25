import { getIdURL } from "./api/config.js";

try {
  const id = getIdURL(window.location.href);
  document.querySelector('#orderId').textContent = id;
} catch {
  console.error("Order 'id' is missing from the URL");
}
