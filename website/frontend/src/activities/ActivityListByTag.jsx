import React from 'react';
import PropTypes from 'prop-types';

import RouterPropTypes from '../common/router-prop-types';

import activitiesBackend from './backend';
import ActivityPagination from './ActivityPagination';


export default class ActivityListByTag extends React.Component {
  constructor(props) {
    super(props);
    this.onLoadPage = this.onLoadPage.bind(this);
  }

  onLoadPage(pageNumber) {
    return activitiesBackend.listActivities({ tag: this.tag, page: pageNumber });
  }

  get tag() {
    return this.props.match.params.tag;
  }

  render() {
    return (
      <div>
        <section>
          <h1>Search by tag: {this.tag || 'N/A'}</h1>
        </section>
        <ActivityPagination key={this.tag} onLoadPage={this.onLoadPage} />
      </div>
    );
  }
}


ActivityListByTag.propTypes = {
  match: RouterPropTypes.match({
    tag: PropTypes.string.isRequired,
  }).isRequired,
};
