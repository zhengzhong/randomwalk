import React from 'react';
import { Link } from 'react-router-dom';

import AccountsPropTypes from './prop-types';
import { profileDetailPath } from './paths';


export default function UserLink({ user, ...props }) {
  return (
    <Link {...props} to={profileDetailPath(user)}>
      {user.display_name || user.username }
    </Link>
  );
}

UserLink.propTypes = {
  user: AccountsPropTypes.user({ requiresPersisted: true }).isRequired,
};
