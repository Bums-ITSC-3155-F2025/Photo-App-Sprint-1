/**
 * FetchModel - Fetch a model from the web server.
 *   url - string - The URL to issue the GET request.
 * Returns: a Promise that resolves to an object of the form
 *   { data: <parsed JSON> }
 * On error, rejects with { status, statusText }.
 */

function fetchModel(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    // Prefer JSON response when available
    try { xhr.responseType = 'json'; } catch (e) { /* older browsers */ }

    xhr.onreadystatechange = function onReady() {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        let data = xhr.response;
        // If responseType not honored, parse manually
        if (data === null || data === undefined) {
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            // Fallback to raw text if not JSON
            data = xhr.responseText;
          }
        }
        resolve({ data });
      } else {
        reject({ status: xhr.status, statusText: xhr.statusText });
      }
    };

    xhr.onerror = function onError() {
      reject({ status: xhr.status || 0, statusText: xhr.statusText || 'Network Error' });
    };

    xhr.send();
  });
}

export default fetchModel;
