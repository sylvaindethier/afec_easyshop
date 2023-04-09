/**
 * Fetch the API
 * @param { String } url URL to fetch
 * @param { ?Object } options Options for the fetch call
 * @param { ?Function(response<Response>) } options.onResponseError Function to call on response error
 * @param { ?Function(error<Error>) } options.onError Function to call on catch error
 * @param { ?Object } options...init Init options for the fetch call
 * @returns { Promise }
 * @returns { Promise.resolve<JSON> } Promise that resolve the JSON response
 * @returns { Promise.reject<Error> } Promise that reject the Error
 */
export async function fetchApi(url, { onResponseError, onError, ...init } ) {
  try {
    let response = await fetch(url, init);
    // get `status` & `statusText` from response
    let { status, statusText } = response;

    // check if response is 200 & OK, if not handle w/ onResponseError
    if (onResponseError instanceof Function && !(status === 200 && statusText == "OK")) {
      // there was a response error
      onResponseError(response);
    }

    // now we can handle response data as JSON and return it
    let json = await response.json();
    return json;
  } catch (error) {
    if (onError instanceof Function) {
      onError(error);
    }
  }
}
