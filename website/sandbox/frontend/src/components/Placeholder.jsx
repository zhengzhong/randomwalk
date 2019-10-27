import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';


export default function Placeholder({ layout }) {
  if (layout === 'media') {
    return (
      <div className="media">
        <div className="placeholder placeholder-img rounded mr-3" />
        <div className="media-body">
          <h2 className="placeholder placeholder-h2 placeholder-w75">&nbsp;</h2>
          <div className="placeholder placeholder-p" />
          <div className="placeholder placeholder-p" />
          <div className="placeholder placeholder-p placeholder-w50" />
        </div>
      </div>
    );
  }

  if (layout === 'table') {
    const $rows = range(4).map(value => (
      <tr key={value}>
        <td><div className="placeholder placeholder-cell" /></td>
        <td><div className="placeholder placeholder-cell" /></td>
        <td><div className="placeholder placeholder-cell" /></td>
      </tr>
    ));
    return (
      <table className="table table-sm table-borderless">
        <tbody>
          {$rows}
        </tbody>
      </table>
    );
  }

  const $sections = range(2).map(value => (
    <div key={value} className="mb-2">
      <h2 className="placeholder placeholder-h2 placeholder-w75">&nbsp;</h2>
      <div className="placeholder placeholder-p" />
      <div className="placeholder placeholder-p" />
      <div className="placeholder placeholder-p placeholder-w50" />
    </div>
  ));
  return (
    <div>
      <h1 className="placeholder placeholder-h1 placeholder-w75">&nbsp;</h1>
      {$sections}
    </div>
  );
}


Placeholder.propTypes = {
  layout: PropTypes.oneOf(['article', 'media', 'table']).isRequired,
};
