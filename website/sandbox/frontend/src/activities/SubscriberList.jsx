import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import PermissionDenied from '../components/PermissionDenied';
import Breadcrumb from '../components/Breadcrumb';

import { UserMedia, UserLink } from '../accounts/components';
import AccountsPropTypes from '../accounts/prop-types';

import activitiesBackend from './backend';
import { homePath, activityDetailPath, subscriberDetailPath } from './paths';
import { canManageActivity } from './permissions';


export default class SubscriberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      activity: null,
      subscribers: [],
      mode: 'summary',
    };
    this.onChangeMode = this.onChangeMode.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this._reloadData();
    }
  }

  onChangeMode(mode) {
    this.setState({ mode });
  }

  get activityPk() {
    return this.props.match.params.activityPk;
  }

  _loadData() {
    activitiesBackend.retrieveActivity(this.activityPk)
      .then((activity) => {
        const { currentUser } = this.props;
        if (!canManageActivity(activity, currentUser)) {
          throw new Error('Permission denied.');
        }
        return Promise.all([
          Promise.resolve(activity),
          activitiesBackend.listSubscribers(this.activityPk, {}),
        ]);
      })
      .then(([activity, subscribers]) => {
        // NOTE: Activity subscribers are NOT paginated.
        this.setState({
          status: 'loaded',
          activity: activity,
          subscribers: subscribers,
          mode: 'summary',
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
    const { activity } = this.state;
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
        title: 'Subscribers',
      },
    ];
    return <Breadcrumb items={items} />;
  }

  renderToolbar() {
    const { activity } = this.state;
    return (
      <div className="btn-toolbar" role="toolbar">
        <div className="btn-group btn-group-sm mr-2" role="group">
          <Link
            className="btn btn-primary btn-light-primary"
            to={activityDetailPath(activity)}
          >
            <i className="fas fa-arrow-left mr-1" />
            Back to activity
          </Link>
        </div>
        <div className="btn-group btn-group-sm mr-2" role="group">
          <button
            className="btn btn-primary btn-light-primary"
            type="button"
            onClick={() => this.onChangeMode('summary')}
          >
            <i className="fas fa-list mr-1" />
            Summary
          </button>
          <button
            className="btn btn-primary btn-light-primary"
            type="button"
            onClick={() => this.onChangeMode('detail')}
          >
            <i className="fas fa-id-card mr-1" />
            Detail
          </button>
        </div>
      </div>
    );
  }

  renderSummary() {
    const { subscribers } = this.state;

    const $subscriberRows = subscribers.map(subscriber => (
      <tr key={subscriber.pk}>
        <td>
          <Link
            className="text-bold text-monospace"
            to={subscriberDetailPath(subscriber)}
          >
            #{subscriber.pk}
          </Link>
        </td>
        <td><UserLink user={subscriber.user} /></td>
        <td>{subscriber.real_name}</td>
        <td>{subscriber.email}</td>
        <td>{subscriber.phone_number}</td>
        <td>{subscriber.status}</td>
      </tr>
    ));

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Real Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {$subscriberRows}
        </tbody>
      </table>
    );
  }

  renderDetail() {
    const { subscribers } = this.state;

    const $subscribers = subscribers.map((subscriber) => {
      const $customFieldItems = subscriber.custom_fields.map(field => (
        <li key={field.uid}>
          <strong className="mr-2">{field.title}</strong>
          <span>{field.value}</span>
        </li>
      ));
      return (
        <div key={subscriber.pk} className="subsection underlined">
          <UserMedia user={subscriber.user}>
            <h3>
              #{subscriber.pk} - {subscriber.real_name}
              {' '} (<UserLink user={subscriber.user} />)
            </h3>
            <ul className="list-inline text-muted mb-1">
              <li className="list-inline-item mr-2">
                <i className="fas fa-envelope mr-1" />
                {subscriber.email}
              </li>
              <li className="list-inline-item">
                <i className="fas fa-phone mr-1" />
                {subscriber.phone_number}
              </li>
            </ul>
            <ul className="list-unstyled mb-1">
              <li>
                <strong className="mr-2">Message</strong>
                <span>{subscriber.message || 'No message.'}</span>
              </li>
              {$customFieldItems}
            </ul>
            <div>
              <span className="badge badge-secondary">
                Status: {subscriber.status}
              </span>
            </div>
          </UserMedia>
        </div>
      );
    });

    return (
      <React.Fragment>
        {$subscribers}
      </React.Fragment>
    );
  }

  render() {
    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const { currentUser } = this.props;
    const { activity, subscribers, mode } = this.state;
    if (!canManageActivity(activity, currentUser)) {
      return <PermissionDenied />;
    }

    let $content = null;
    if (subscribers.length === 0) {
      $content = (
        <div className="alert alert-info">
          <i className="fas fa-info-circle mr-1" />
          No subscribers yet.
        </div>
      );
    } else if (mode === 'summary') {
      $content = this.renderSummary();
    } else {
      $content = this.renderDetail();
    }

    return (
      <div>
        {this.renderBreadcrumb()}
        <section>
          <h1>Subscribers</h1>
          {this.renderToolbar()}
        </section>
        <section>
          {$content}
        </section>
      </div>
    );
  }
}


SubscriberList.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  match: RouterPropTypes.match({
    activityPk: PropTypes.string.isRequired,
  }).isRequired,
};

SubscriberList.defaultProps = {
  currentUser: null,
};
