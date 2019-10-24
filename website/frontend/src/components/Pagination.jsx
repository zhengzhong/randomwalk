import React from 'react';
import PropTypes from 'prop-types';

import queryString from 'query-string';


/**
 * Parses and extracts the `page` query param from the URL string. We cannot use `URL` class
 * because it is not supported by IE.
 */
function parsePageQueryParam(urlString) {
  if (!urlString) {
    return null;
  }
  const match = urlString.match(/^[^?]*\?([^#]*)(?:#.*)?$/);
  if (!match) {
    return null;
  }
  const search = match[1];
  const query = queryString.parse(search);
  return query.page || null;
}


/**
 * A fully uncontrolled component to load and render paginated results.
 *
 * The component uses the `status` state to control how the pager will be rendered:
 *
 * - null: The initial page has not yet been loaded.
 * - 'loading': We are currently loading a page.
 * - 'ready': All requested pages have been loaded.
 * - an Error instance: An error occurred when loading page.
 */
export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      results: [],
      nextPageNumber: null,
    };
    this.loadPage = this.loadPage.bind(this);
  }

  componentDidMount() {
    this.loadPage(this.props.initialPageNumber);
  }

  loadPage(pageNumber) {
    this.setState({ status: 'loading' }, () => {
      Promise.resolve(this.props.onLoadPage(pageNumber))
        .then((page) => {
          this.setState((prevState) => {
            const results = prevState.results.concat(page.results || []);
            const nextPageNumber = parsePageQueryParam(page.next);
            return {
              status: 'ready',
              results: results,
              nextPageNumber: nextPageNumber,
            };
          });
        })
        .catch((error) => {
          console.log(`Fail to load page ${pageNumber}: ${error}`);
          this.setState({ status: error });
        });
    });
  }

  renderLoadMore() {
    const { status, nextPageNumber } = this.state;

    if (status === null || status === 'loading') {
      return (
        <div className="text-center m-4">
          <div className="spinner-grow text-muted" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    if (status instanceof Error) {
      return (
        <div className="text-danger m-4">
          Fail to load data.
        </div>
      );
    }

    if (nextPageNumber === null) {
      return <React.Fragment />;
    }
    return (
      <div className="text-center m-4">
        <button
          className="anchor text-muted text-decoration-none"
          type="button"
          onClick={() => this.loadPage(nextPageNumber)}
        >
          Load More
        </button>
      </div>
    );
  }

  render() {
    const { status, results } = this.state;

    // Render results only after the initial page is loaded. We call `this.props.children()` only
    // if the loaded results are not empty. Otherwise, we render a generic alert.
    let $results = null;
    if (status !== null) {
      if (results.length > 0) {
        $results = this.props.children(results);
      } else {
        $results = (
          <div className="alert alert-info">
            <i className="fas fa-info-circle mr-1" />
            No results found.
          </div>
        );
      }
    }

    return (
      <React.Fragment>
        {$results}
        {this.renderLoadMore()}
      </React.Fragment>
    );
  }
}


Pagination.propTypes = {
  initialPageNumber: PropTypes.number,
  onLoadPage: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  initialPageNumber: 1,
};
