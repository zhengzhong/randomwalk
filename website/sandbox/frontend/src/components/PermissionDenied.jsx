import React from 'react';
import PropTypes from 'prop-types';

export default function PermissionDenied({ redirectUrl }) {
  console.log(`Permission denied: redirectUrl = ${redirectUrl}`);
  return (
    <div className="alert alert-danger my-2">
      <i className="fas fa-exclamation-triangle mr-1" />
      Permission Denied.
    </div>
  );
}

PermissionDenied.propTypes = {
  redirectUrl: PropTypes.string,
};

PermissionDenied.defaultProps = {
  redirectUrl: null,
};
