/**
 * Fetch the API
 * @param { String } url The URL to fetch
 * @param { ?Object } options The options for the fetch call
 * @param { ?Function(response<Response>) } options.onResponseError Function to call on response error
 * @param { ?Function(error<Error>) } options.onError Function to call on catch error
 * @param { ?Object } options...init Init options for the fetch call
 * @returns { Promise<JSON, Error> } Promise that resolve to the JSON response or reject to the Error response otherwise
 */
export default async function fetchApi(url, { onResponseError, onError, ...init } ) {
  try {
    let response = await fetch(url, init);
    // get `status` & `statusText` from response
    let { status, statusText } = response;

    // check if response is 200 & OK
    if (!(status === 200 && statusText == "OK")) {
      // there was a response error
      if (onResponseError instanceof Function) {
        onResponseError(response)
      } else {
        return response;
      }
    }

    // now we can handle response data as JSON and return it
    return await response.json();
  } catch (error) {
    if (onError instanceof Function) {
      onError(error);
    } else {
      throw new Error(error);
    }
  }
}
