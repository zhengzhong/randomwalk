import React from 'react';

import AccountsPropTypes from './prop-types';
import { absoluteUrl, profileDetailPath } from './paths';


export default function UserLink({ user, ...props }) {
  // TODO: How to build a cross-app link?
  return (
    <a {...props} href={absoluteUrl(profileDetailPath(user))}>
      {user.display_name || user.username }
    </a>
  );
}

UserLink.propTypes = {
  user: AccountsPropTypes.user({ requiresPersisted: true }).isRequired,
};
