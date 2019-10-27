import React from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';

export default function LoadingOrError({ status }) {
  if (status === null) {
    return <Spinner />;
  }
  if (status instanceof Error) {
    return <ErrorAlert error={status} />;
  }
  console.log(`Status ${status} is neither null nor Error: Nothing to render.`);
  return <div style={{ display: 'none' }} />;
}

LoadingOrError.propTypes = {
  status: PropTypes.instanceOf(Error),
};

LoadingOrError.defaultProps = {
  status: null,
};
