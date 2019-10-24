import React from 'react';
import PropTypes from 'prop-types';

import AccountsPropTypes from './prop-types';


export default function UserMedia({ user, children }) {
  return (
    <div className="media">
      <img
        className="rounded-circle img-thumbnail img-w80 mr-3"
        src={user.avatar_url}
        alt="User Avatar"
      />
      <div className="media-body">
        {children}
      </div>
    </div>
  );
}

UserMedia.propTypes = {
  user: AccountsPropTypes.user({ requiresPersisted: true }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
