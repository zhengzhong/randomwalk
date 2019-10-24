import React from 'react';

import { prettifyDate } from '../common/utils';
import { UserMedia, UserLink } from '../accounts/components';

import ActivityPropTypes from './prop-types';


export default function ActivitySidebar({ activity }) {
  return (
    <React.Fragment>

      <section>
        <div className="card card-light">
          <div className="card-body">
            <div className="mb-2">
              <div className="text-muted">
                <i className="fas fa-users mr-1" />
                Subscribed
              </div>
              <div>
                <span className="text-lg">{activity.headcount}</span>
                {activity.max_headcount !== null && activity.max_headcount > 0 && (
                  <span className="text-muted ml-1">/ {activity.max_headcount}</span>
                )}
              </div>
            </div>
            <div className="mb-2">
              <div className="text-muted">
                <i className="fas fa-comment-dollar mr-1" />
                Price
              </div>
              <div className="text-lg">
                {activity.base_price}€
              </div>
            </div>
            <div className="mb-2">
              <div className="text-muted">
                <i className="fas fa-calendar-day mr-1" />
                Date
              </div>
              <div className="text-lg">
                {activity.scheduled_date}
              </div>
            </div>
            <div className="mb-0">
              <div className="text-muted">
                <i className="fas fa-map-marked mr-1" />
                Address
              </div>
              <div>
                {activity.address}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <UserMedia user={activity.creator}>
          <h5><UserLink user={activity.creator} /></h5>
          <div className="text-muted mb-1">
            Published {prettifyDate(activity.create_date)}
          </div>
        </UserMedia>
      </section>

    </React.Fragment>
  );
}

ActivitySidebar.propTypes = {
  activity: ActivityPropTypes.activity({ requiresPersisted: true }).isRequired,
};
