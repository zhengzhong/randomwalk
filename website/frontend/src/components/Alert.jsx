import React from 'react';
import PropTypes from 'prop-types';

const ALERT_STYLES = {
  primary: {
    elemClassName: 'alert alert-primary',
    iconClassName: 'ic ic-info',
  },
  success: {
    elemClassName: 'alert alert-success',
    iconClassName: 'ic ic-check',
  },
  warning: {
    elemClassName: 'alert alert-warning',
    iconClassName: 'ic ic-exclamation',
  },
  error: {
    elemClassName: 'alert alert-danger',
    iconClassName: 'ic ic-exclamation',
  },
};

function Alert({ type, text, children }) {
  const style = ALERT_STYLES[type];
  const $children = children || (
    <span>
      <i className={`${style.iconClassName} mr-1`} />
      {text || 'Neither children nor text is not provided.'}
    </span>
  );
  return (
    <div className={`${style.elemClassName} my-2`}>
      {$children}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(['primary', 'success', 'warning', 'error']).isRequired,
  text: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Alert.defaultProps = {
  text: null,
  children: null,
};

export default Alert;
