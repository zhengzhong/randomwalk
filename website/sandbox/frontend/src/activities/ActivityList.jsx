import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import RouterPropTypes from '../common/router-prop-types';

import activitiesBackend from './backend';
import { activityListPath } from './paths';
import ActivityPagination from './ActivityPagination';


export default class ActivityList extends React.Component {
  constructor(props) {
    super(props);
    this.onLoadPage = this.onLoadPage.bind(this);
  }

  onLoadPage(pageNumber) {
    return activitiesBackend.listActivities({ scheduled: this.scheduled, page: pageNumber });
  }

  get scheduled() {
    return this.props.match.params.scheduled;
  }

  render() {
    let title = null;
    if (this.scheduled === 'upcoming') {
      title = 'Upcoming Activities';
    } else if (this.scheduled === 'past') {
      title = 'Past Activities';
    } else {
      title = `${this.scheduled} ?`;
    }

    return (
      <div>
        <h1 className="section">{title}</h1>
        <section>
          <nav className="nav nav-bordered nav-justified">
            <Link
              className={`nav-item nav-link ${this.scheduled === 'upcoming' ? 'active' : ''}`}
              to={activityListPath('upcoming')}
            >
              Upcoming
            </Link>
            <Link
              className={`nav-item nav-link ${this.scheduled === 'past' ? 'active' : ''}`}
              to={activityListPath('past')}
            >
              Past
            </Link>
          </nav>
        </section>
        <ActivityPagination key={this.scheduled} onLoadPage={this.onLoadPage} />
      </div>
    );
  }
}


ActivityList.propTypes = {
  match: RouterPropTypes.match({
    scheduled: PropTypes.oneOf(['upcoming', 'past']).isRequired,
  }).isRequired,
};
