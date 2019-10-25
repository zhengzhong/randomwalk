import React from 'react';
import PropTypes from 'prop-types';

import RouterPropTypes from '../common/router-prop-types';

import activitiesBackend from './backend';
import { homePath } from './paths';
import Breadcrumb from '../components/Breadcrumb';
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

  // eslint-disable-next-line class-methods-use-this
  renderBreadcrumb() {
    const items = [
      {
        title: 'Home',
        path: homePath(),
      },
      {
        title: 'Search by tag',
      },
    ];
    return <Breadcrumb items={items} />;
  }

  render() {
    return (
      <div>
        {this.renderBreadcrumb()}
        <h1 className="section">Search by tag: {this.tag || 'N/A'}</h1>
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
