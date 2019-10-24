import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import Breadcrumb from '../components/Breadcrumb';

import AccountsPropTypes from '../accounts/prop-types';

import activitiesBackend from './backend';
import { homePath, activityDetailPath, subscriberUpdatePath } from './paths';
import { canUnsubscribe, canUpdateSubscriber } from './permissions';
import ActivitySidebar from './ActivitySidebar';


export default class SubscriberDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      activity: null,
      subscriber: null,
    };
    this.onUnsubscribe = this.onUnsubscribe.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this._reloadData();
    }
  }

  onUnsubscribe() {
    const { currentUser } = this.props;
    const { activity, subscriber } = this.state;
    if (!canUnsubscribe(subscriber, currentUser)) {
      console.log('Current user cannot unsubscribe.');
      return;
    }
    activitiesBackend.destroySubscriber(activity.pk, subscriber.pk)
      .then(() => {
        const path = activityDetailPath(activity);
        this.props.history.replace(path);
      })
      .catch((error) => {
        console.log(`Fail to unsubscribe: ${error}`);
      });
  }

  get activityPk() {
    return this.props.match.params.activityPk;
  }

  get subscriberPk() {
    return this.props.match.params.subscriberPk;
  }

  _loadData() {
    const promises = [
      activitiesBackend.retrieveActivity(this.activityPk),
      activitiesBackend.retrieveSubscriber(this.activityPk, this.subscriberPk),
    ];
    Promise.all(promises)
      .then(([activity, subscriber]) => {
        this.setState({
          status: 'loaded',
          activity: activity,
          subscriber: subscriber,
        });
      })
      .catch((error) => {
        this.setState({
          status: error,
        });
      });
  }

  _reloadData() {
    this.setState({ status: null }, () => this._loadData());
  }

  renderBreadcrumb() {
    const { activity, subscriber } = this.state;
    const items = [
      {
        title: 'Home',
        path: homePath(),
      },
      {
        title: activity.title,
        path: activityDetailPath(activity),
      },
      {
        title: `Subscription #${subscriber.pk}`,
      },
    ];
    return <Breadcrumb items={items} />;
  }

  renderToolbar() {
    const { currentUser } = this.props;
    const { activity, subscriber } = this.state;
    return (
      <div className="btn-toolbar" role="toolbar">
        <div className="btn-group btn-group-sm mr-2">
          <Link
            className="btn btn-primary btn-light-primary"
            to={activityDetailPath(activity)}
          >
            <i className="fas fa-arrow-left mr-1" />
            Back to activity
          </Link>
        </div>
        {canUpdateSubscriber(subscriber, currentUser) && (
          <div className="btn-group btn-group-sm mr-2">
            <Link
              className="btn btn-primary btn-light-primary"
              to={subscriberUpdatePath(subscriber)}
            >
              <i className="fas fa-edit mr-1" />
              Update
            </Link>
          </div>
        )}
        {canUnsubscribe(subscriber, currentUser) && (
          <div className="btn-group btn-group-sm mr-2">
            <button
              className="btn btn-primary btn-light-primary"
              type="button"
              onClick={this.onUnsubscribe}
            >
              <i className="fas fa-user-minus mr-1" />
              Unsubscribe
            </button>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const { currentUser } = this.props;
    const { activity, subscriber } = this.state;

    const $warnings = [];
    if (currentUser && currentUser.username === subscriber.user.username) {
      if (!subscriber.is_phone_number_verified) {
        $warnings.push((
          <div key="phone_number_unverified" className="alert alert-warning">
            <i className="fas fa-exclamation-triangle mr-1" />
            You have not yet verified your phone number. {' '}
            <a href="#TODO">
              Verify your phone number now.
            </a>
          </div>
        ));
      }
      if (subscriber.calculated_price > 0 && !subscriber.is_paid) {
        $warnings.push((
          <div key="unpaid" className="alert alert-warning">
            <i className="fas fa-exclamation-triangle mr-1" />
            You have not yet paid the subscription fee. {' '}
            {subscriber.payment_key ? (
              <a href="#TODO">
                Make your payment now.
              </a>
            ) : (
              <strong>Please contact the activity organizers.</strong>
            )}
          </div>
        ));
      }
    }

    const $customFieldRows = subscriber.custom_fields.map(field => (
      <tr key={field.uniqueId}>
        <th>{field.title}</th>
        <td>{field.value}</td>
      </tr>
    ));

    let $priceRow = null;
    if (subscriber.calculated_price > 0) {
      $priceRow = (
        <tr>
          <th>Price</th>
          <td>
            <strong className="text-monospace">
              {subscriber.calculated_price}€
            </strong>
            {subscriber.is_paid ? (
              <span className="badge badge-success badge-outline ml-2">
                <i className="fas fa-check mr-1" />
                Paid
              </span>
            ) : (
              <span className="badge badge-danger badge-outline ml-2">
                <i className="fas fa-exclamation-triangle mr-1" />
                Unpaid
              </span>
            )}
          </td>
        </tr>
      );
    }

    return (
      <div>

        {this.renderBreadcrumb()}

        <section>
          <h1>Subscription #{subscriber.pk}</h1>
          {this.renderToolbar()}
        </section>

        <div className="row">

          <div className="col-8">
            <section>
              {$warnings}
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th style={{ width: '50%' }}>Subscription ID</th>
                    <td><strong className="text-monospace">{subscriber.pk}</strong></td>
                  </tr>
                  <tr>
                    <th>Real Name</th>
                    <td>{subscriber.real_name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>
                      <span className="text-monospace">
                        {subscriber.email}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>
                      <span className="text-monospace">
                        {subscriber.phone_number}
                      </span>
                      {subscriber.is_phone_number_verified ? (
                        <span className="badge badge-success badge-outline ml-2">
                          <i className="fas fa-check mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="badge badge-danger badge-outline ml-2">
                          <i className="fas fa-exclamation-triangle mr-1" />
                          Unverified
                        </span>
                      )}
                    </td>
                  </tr>
                  {$customFieldRows}
                  <tr>
                    <th>Message</th>
                    <td>{subscriber.message}</td>
                  </tr>
                  {$priceRow}
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className="badge badge-secondary">
                        {subscriber.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>

          <div className="col-4">
            <ActivitySidebar activity={activity} />
          </div>

        </div>

      </div>
    );
  }
}


SubscriberDetail.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  history: RouterPropTypes.history().isRequired,
  match: RouterPropTypes.match({
    activityPk: PropTypes.string.isRequired,
    subscriberPk: PropTypes.string.isRequired,
  }).isRequired,
};

SubscriberDetail.defaultProps = {
  currentUser: null,
};
