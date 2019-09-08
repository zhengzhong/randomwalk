import rest from '../common/rest';

const URL_PREFIX = '/restified/v3/activities/';

export default {

  getGroup(groupSlug) {
    const url = `${URL_PREFIX}groups/${groupSlug}/`;
    return rest.get(url);
  },

  getActivityList(groupSlug) {
    const url = `${URL_PREFIX}activities/${groupSlug}/`;
    return rest.get(url);
  },

  createActivity(groupSlug, activity) {
    const url = `${URL_PREFIX}activities/${groupSlug}/`;
    return rest.post(url, activity);
  },
};
