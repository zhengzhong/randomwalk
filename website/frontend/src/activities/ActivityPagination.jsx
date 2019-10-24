import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { convertToPlainText, truncateChars, prettifyDate } from '../common/utils';
import Pagination from '../components/Pagination';

import { UserLink } from '../accounts/components';

import { activityDetailPath, activityListByTagPath } from './paths';


export default function ActivityPagination({ onLoadPage }) {
  return (
    <Pagination onLoadPage={onLoadPage}>
      {(results) => {
        const $activities = results.map(activity => (
          <section key={activity.pk} className="underlined">
            <h2 className="card-title">
              <Link to={activityDetailPath(activity)}>
                {activity.title}
              </Link>
            </h2>
            <ul className="list-inline text-muted">
              <li className="list-inline-item">
                <i className="fas fa-calendar-day mr-1" />
                {activity.scheduled_date}
              </li>
              <li className="list-inline-item">
                <i className="fas fa-map-marked mr-1" />
                {activity.address}
              </li>
            </ul>
            {activity.tag_list.length > 0 && (
              <ul className="list-inline">
                {activity.tag_list.map(tag => (
                  <li key={tag} className="list-inline-item">
                    <Link
                      className="badge badge-lg badge-muted badge-outline"
                      to={activityListByTagPath(tag)}
                    >
                      <i className="fas fa-tag mr-1" />
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="card-text">
              {truncateChars(convertToPlainText(activity.description), 500)}
            </p>
            <div className="d-flex justify-content-between text-sm text-muted">
              <div>
                <i className="fas fa-user mr-1" />
                Published {prettifyDate(activity.create_date)} by {' '}
                <UserLink className="text-bold" user={activity.creator} />
              </div>
              {activity.headcount > 0 && (
                <div>
                  <strong>{activity.headcount}</strong>
                  {' '} users have subscribed
                </div>
              )}
            </div>
          </section>
        ));
        return (
          <React.Fragment>
            {$activities}
          </React.Fragment>
        );
      }}
    </Pagination>
  );
}


ActivityPagination.propTypes = {
  onLoadPage: PropTypes.func.isRequired,
};
