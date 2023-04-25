/**
 * Fetch an URL
 * @param {RequestInfo | URL} url The URL to fetch
 * @param {Object} [options] The options for the fetch call
 * @param {RequestInit} [options...init] The init object for the fetch call
 * @param {((response: Response) => void)} [options.onResponseError] The callback to handle response error
 * @param {((error: Error) => void)} [options.onError] The callback to handle catch error
 * @returns {Promise<JSON>} Promise that resolve to the JSON response
 */
export default async function fetchURL(url, options = {}) {
  const { onResponseError, onError, ...init } = options;
  try {
    console.info("@fetchURL", "url", url, "init", init);
    let response = await fetch(url, init);

    // check if response is OK & return response data as JSON
    if (response.ok) {
      return await response.json();
    }

    // there was a response error
    if (onResponseError instanceof Function) {
      onResponseError(response);
    } else {
      return response;
    }
  } catch (error) {
    if (onError instanceof Function) {
      onError(error);
    } else {
      throw new Error(error);
    }
  }
}
