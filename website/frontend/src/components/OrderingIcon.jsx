import React from 'react';
import PropTypes from 'prop-types';

export default function OrderingIcon(props) {
  const ordering = props.ordering;
  if (!ordering) {
    return <span style={{ display: 'none' }} />;
  }
  if (String(ordering).startsWith('-')) {
    return <i className="fas fa-sort-alpha-up mx-1" />;
  }
  return <i className="fas fa-sort-alpha-down mx-1" />;
}

OrderingIcon.propTypes = {
  ordering: PropTypes.string,
};

OrderingIcon.defaultProps = {
  ordering: null,
};
