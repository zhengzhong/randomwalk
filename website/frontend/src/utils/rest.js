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


function handleJSONResponse(response) {
  if (!response) {
    throw new Error(`Invalid response received: ${response}`);
  } else if (!response.ok) {
    throw new Error(`Response from ${response.url} is not OK (status: ${response.status}).`);
  } else {
    try {
      return response.json();
    } catch (err) {
      throw new Error(`Fail to parse JSON response from ${response.url}: ${err}`);
    }
  }
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
