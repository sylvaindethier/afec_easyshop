/**
 * Get a URLSearchParams from an URL
 * @param { String } name The name of the URLSearchParams to get
 * @param { ?String | ?URL } url The URL from which to get the URLSearchParams
 * @throws { Error } Whenever the name is missing from the URLSearchParams
 * @returns { String } The value of the URLSearchParams
 */
export default function getURLSearchParam(name, url = window.location.href) {
  // url hast to be an instance of URL
  if (!(url instanceof URL)) {
    url = new URL(url);
  }

  // get URLSearchParams
  const searchParams = url.searchParams;
  // check if URLSSearchParams has name
  if (!searchParams.has(name)) {
    throw new Error(`Missing '${name}' from URLSearchParams`);
  }

  // return its value
  return searchParams.get(name);
}
