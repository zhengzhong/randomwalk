import React from 'react';
import PropTypes from 'prop-types';

function LoadingIndicator({ text }) {
  return (
    <div className="my-2 p-2 text-muted">
      <i className="ic ic-spinner ic-spin mr-1" /> {text}
    </div>
  );
}

LoadingIndicator.propTypes = {
  text: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  text: 'Loading...',
};

export default LoadingIndicator;
