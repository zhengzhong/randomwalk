import React from 'react';
import PropTypes from 'prop-types';


// Regular expression to match a blank paragraph.
const BLANK_REGEX = /<p>(\s*<br\s*\/?>\s*)*<\/p>/gi;


export default function DangerousHTML({ html, trimBlank, ...otherProps }) {
  let cleanedHtml = html || '';
  if (trimBlank) {
    cleanedHtml = cleanedHtml.replace(BLANK_REGEX, '');
  }
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} {...otherProps} />;
}

DangerousHTML.propTypes = {
  html: PropTypes.string.isRequired,
  trimBlank: PropTypes.bool,
};

DangerousHTML.defaultProps = {
  trimBlank: true,
};
