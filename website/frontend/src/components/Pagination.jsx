import React from 'react';
import PropTypes from 'prop-types';

function Pagination({ pagination, onClickPage }) {
  if (!pagination) {
    return <div />;
  }

  // Build links to a range of pages.
  const firstPageNumber = Math.max(pagination.number - 5, 1);
  const lastPageNumber = Math.min(pagination.number + 5, pagination.num_pages);
  const $pageLinks = [];
  for (let i = firstPageNumber; i <= lastPageNumber; i++) {
    let $pageLink = null;
    if (i === pagination.number) {
      $pageLink = (
        <li key={i} className="page-item active">
          <span className="page-link">{i}</span>
        </li>
      );
    } else {
      $pageLink = (
        <li key={i} className="page-item">
          <button className="page-link" type="button" onClick={() => onClickPage(i)}>{i}</button>
        </li>
      );
    }
    $pageLinks.push($pageLink);
  }

  // Add links to the first and last page if necessary.
  if (firstPageNumber > 1) {
    $pageLinks.unshift((
      <li className="page-item">
        <button className="page-link" type="button" onClick={() => onClickPage(1)}>
          <span>&laquo;&laquo;</span>
        </button>
      </li>
    ));
  }
  if (lastPageNumber < pagination.num_pages) {
    $pageLinks.push((
      <li className="page-item">
        <button className="page-link" type="button" onClick={() => onClickPage(pagination.num_pages)}>
          <span>&raquo;&raquo;</span>
        </button>
      </li>
    ));
  }

  // Render the pagination.
  return (
    <nav>
      <ul className="pagination justify-content-center">
        {$pageLinks}
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    num_pages: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
  }),
  onClickPage: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  pagination: null,
};

export default Pagination;
