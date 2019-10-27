
export function canCreateActivity(currentUser) {
  return currentUser && currentUser.is_staff;
}


export function canManageActivity(activity, currentUser) {
  if (!activity || !currentUser) {
    return false;
  }
  return activity.creator.username === currentUser.username || currentUser.is_staff;
}


export function canUnsubscribe(subscriber, currentUser) {
  if (!subscriber || !currentUser) {
    return false;
  }
  return subscriber.user.username === currentUser.username;
}


export function canUpdateSubscriber(subscriber, currentUser) {
  if (!subscriber || !currentUser) {
    return false;
  }
  return subscriber.user.username === currentUser.username || currentUser.is_staff;
}


export default {
};
