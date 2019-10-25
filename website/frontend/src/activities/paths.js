export const APP_BASENAME = '/frontend/activities';

export function homePath() {
  return '/';
}

export function activityDetailPath(activity) {
  return `/activity/detail/${activity.pk}`;
}

export function activityUpdatePath(activity) {
  return `/activity/update/${activity.pk}`;
}

export function activityListPath(scheduled) {
  return `/activity/list/${scheduled}`;
}

export function activityListByTagPath(tag) {
  return `/activity/tag/${tag}`;
}

export function subscriberCreatePath(activity) {
  return `/subscriber/create/${activity.pk}`;
}

export function subscriberDetailPath(subscriber) {
  return `/subscriber/detail/${subscriber.activity_pk}/${subscriber.pk}`;
}

export function subscriberUpdatePath(subscriber) {
  return `/subscriber/update/${subscriber.activity_pk}/${subscriber.pk}`;
}

export function subscriberListPath(activity) {
  return `/subscriber/list/${activity.pk}`;
}

export default {

};
