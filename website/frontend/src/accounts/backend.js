import rest from '../common/rest';

const URL_PREFIX = '/restified/v3/accounts/';

const KEY_AUTH = 'v5.frontend.accounts.auth';

export default {

  login(username, password) {
    const url = `${URL_PREFIX}auth/login/`;
    return rest.post(url, { username, password })
      .then((data) => {
        window.localStorage.setItem(KEY_AUTH, JSON.stringify(data));
        return data.profile;
      });
  },

  logout() {
    const url = `${URL_PREFIX}auth/logout/`;
    return rest.post(url)
      .then((data) => {
        window.localStorage.removeItem(KEY_AUTH);
        return data;
      });
  },

  retrieveProfile(username) {
    const url = `${URL_PREFIX}profiles/${username}/`;
    return rest.get(url);
  },

  /**
   * Retrieves the current authenticated user from server.
   */
  retrieveMyProfile() {
    const url = `${URL_PREFIX}profiles/my/`;
    return rest.get(url);
  },
};
