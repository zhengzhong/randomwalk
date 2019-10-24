import React from 'react';
import PropTypes from 'prop-types';

import queryString from 'query-string';


export default function LoadMore({ page, status, onLoadMore }) {
  if (!page || !page.next) {
    return <React.Fragment />;
  }

  const query = queryString.parse(page.next);
  const nextPageNumber = query.page || null;
  if (!nextPageNumber) {
    console.log(`Cannot get next page number from next URL: ${page.next}`);
    return <React.Fragment />;
  }

  let $pager = null;
  if (!status) {
    $pager = (
      <button
        className="anchor text-muted text-decoration-none"
        type="button"
        onClick={() => onLoadMore(nextPageNumber)}
      >
        Load More
      </button>
    );
  } else if (status === 'loading') {
    $pager = (
      <div className="spinner-grow text-muted" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else {
    $pager = (
      <div className="text-danger">
        {status}
      </div>
    );
  }

  return (
    <div className="text-center my-2">
      {$pager}
    </div>
  );
}


LoadMore.propTypes = {
  page: PropTypes.shape({
    next: PropTypes.string,
  }),
  status: PropTypes.string,
  onLoadMore: PropTypes.func.isRequired,
};

LoadMore.defaultProps = {
  page: null,
  status: null,
};
