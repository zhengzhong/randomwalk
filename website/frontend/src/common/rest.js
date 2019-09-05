import Cookies from 'js-cookie';


function toQueryString(obj) {
  const parts = Object.keys(obj).reduce((accumulator, key) => {
    const value = obj[key];
    if (value) {
      const part = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      return accumulator.concat([part]);
    }
    return accumulator; // Omit all falsy values (null, undefined, empty string) in query string.
  }, []);
  return parts.join('&');
}


function makeJSONOptions(method, payload) {
  const options = {
    credentials: 'same-origin',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: method,
  };
  if (method !== 'GET' && payload) {
    options.body = JSON.stringify(payload);
  }
  return options;
}


function makePostFormOptions(formData) {
  return {
    credentials: 'same-origin',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Accept': 'application/json',
    },
    method: 'POST',
    body: formData,
  };
}


function createBackendError(message, response) {
  const error = new Error(message);
  error.url = response.url;
  error.status = response.status;
  return error;
}


function handleJSONResponse(response) {
  if (!response) {
    throw new Error('Invalid empty response received from server.');
  }
  if (!response.ok) {
    // When an error occurred, detail may be provided as the JSON. Try to parse that out.
    // Note that `response.json()` returns a Promise, not the parsed JSON object.
    return response.json()
      .then((data) => {
        console.log(`Got error JSON with status code: ${response.status} ( ${response.url}`);
        throw createBackendError(data.message || 'An error occurred.', response);
      }, () => {
        console.log(`Fail to get error JSON with status code: ${response.status} ( ${response.url}`);
        throw createBackendError('An error occurred.', response);
      });
  }
  if (response.status === 204) {
    // 204 - No content.
    return null;
  }
  return response.json();
}


export default {

  get(url, query) {
    const completeUrl = (query ? `${url}?${toQueryString(query)}` : url);
    console.log(`GET ${completeUrl}`);
    return fetch(completeUrl, makeJSONOptions('GET'))
      .then(response => handleJSONResponse(response));
  },

  post(url, payload) {
    console.log(`POST ${url}`);
    return fetch(url, makeJSONOptions('POST', payload))
      .then(response => handleJSONResponse(response));
  },

  postForm(url, formData) {
    console.log(`POST (form) ${url}`);
    return fetch(url, makePostFormOptions(formData))
      .then(response => handleJSONResponse(response));
  },

  put(url, payload) {
    console.log(`PUT ${url}`);
    return fetch(url, makeJSONOptions('PUT', payload))
      .then(response => handleJSONResponse(response));
  },

  delete(url, payload) {
    console.log(`DELETE ${url}`);
    return fetch(url, makeJSONOptions('DELETE', payload))
      .then(response => handleJSONResponse(response));
  },

};
