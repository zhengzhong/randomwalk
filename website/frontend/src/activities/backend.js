import rest from '../common/rest';

const URL_PREFIX = '/restified/v3/activities/';

export default {

  retrieveGroup(groupSlug) {
    const url = `${URL_PREFIX}groups/${groupSlug}/`;
    return rest.get(url);
  },

  createActivity(activity) {
    const url = `${URL_PREFIX}/activities/`;
    return rest.post(url, activity);
  },

  retrieveActivity(activityPk) {
    const url = `${URL_PREFIX}activities/${activityPk}/`;
    return rest.get(url);
  },

  updateActivity(activity) {
    const url = `${URL_PREFIX}activities/${activity.pk}/`;
    return rest.put(url, activity);
  },

  listActivities(query) {
    const url = `${URL_PREFIX}activities/`;
    return rest.get(url, query);
  },

  updateActivityTags(activity, action, tag) {
    const url = `${URL_PREFIX}activities/${activity.pk}/tags/`;
    const payload = { action, tag };
    return rest.post(url, payload);
  },

  createSubscriber(activity, subscriber) {
    const url = `${URL_PREFIX}activities/${activity.pk}/subscribers/`;
    return rest.post(url, subscriber);
  },

  retrieveSubscriber(activityPk, subscriberPk) {
    const url = `${URL_PREFIX}activities/${activityPk}/subscribers/${subscriberPk}/`;
    return rest.get(url);
  },

  updateSubscriber(subscriber) {
    const url = `${URL_PREFIX}activities/${subscriber.activity_pk}/subscribers/${subscriber.pk}/`;
    return rest.put(url, subscriber);
  },

  destroySubscriber(activityPk, subscriberPk) {
    const url = `${URL_PREFIX}activities/${activityPk}/subscribers/${subscriberPk}`;
    return rest.delete(url);
  },

  listSubscribers(activityPk, query) {
    const url = `${URL_PREFIX}activities/${activityPk}/subscribers/`;
    return rest.get(url, query);
  },

  retrieveMySubscriber(activityPk) {
    const url = `${URL_PREFIX}activities/${activityPk}/subscribers/current-user/`;
    return rest.get(url);
  },
};
