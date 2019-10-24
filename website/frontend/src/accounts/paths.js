export function loginPath() {
  return '/login';
}

export function logoutPath() {
  return '/logout';
}

export function myProfilePath() {
  return '/profile/my';
}

export function profileDetailPath(profile) {
  return `/profile/detail/${profile.username}`;
}

export function profileUpdatePath(profile) {
  return `/profile/update/${profile.username}`;
}

export default {

};
