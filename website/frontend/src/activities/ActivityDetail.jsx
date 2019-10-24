import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import Breadcrumb from '../components/Breadcrumb';
import DangerousHTML from '../components/DangerousHTML';

import AccountsPropTypes from '../accounts/prop-types';

import activitiesBackend from './backend';
import {
  homePath,
  activityUpdatePath,
  subscriberDetailPath,
  subscriberCreatePath,
  subscriberListPath,
} from './paths';
import { canManageActivity } from './permissions';

import ActivitySidebar from './ActivitySidebar';
import ActivityTagList from './ActivityTagList';


export default class ActivityDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      activity: null,
      mySubscriber: null,
    };
    this.onUpdateTag = this.onUpdateTag.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this._reloadData();
    }
  }

  onUpdateTag(action, tag) {
    const { activity } = this.state;
    activitiesBackend.updateActivityTags(activity, action, tag)
      .then((partialActivity) => {
        this.setState((prevState) => {
          const updatedActivity = Object.assign({}, prevState.activity, partialActivity);
          return { activity: updatedActivity };
        });
      });
  }

  get activityPk() {
    return this.props.match.params.activityPk;
  }

  _loadData() {
    const promises = [
      activitiesBackend.retrieveActivity(this.activityPk),
      activitiesBackend.retrieveMySubscriber(this.activityPk),
    ];
    Promise.all(promises)
      .then(([activity, mySubscriber]) => {
        this.setState({
          status: 'loaded',
          activity: activity,
          mySubscriber: mySubscriber,
        });
      })
      .catch((error) => {
        this.setState({
          status: error,
          activity: null,
          mySubscriber: null,
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
      },
    ];
    return <Breadcrumb items={items} />;
  }

  renderToolbar() {
    const { currentUser } = this.props;
    const { activity } = this.state;
    if (!canManageActivity(activity, currentUser)) {
      return <React.Fragment />;
    }

    return (
      <div className="btn-toolbar" role="toolbar">
        <div className="btn-group btn-group-sm mr-2" role="group">
          <Link
            className="btn btn-primary btn-light-primary"
            to={activityUpdatePath(activity)}
          >
            <i className="fas fa-edit mr-1" />
            Update
          </Link>
        </div>
        <div className="btn-group btn-group-sm mr-2" role="group">
          <Link
            className="btn btn-primary btn-light-primary"
            to={subscriberListPath(activity)}
          >
            <i className="fas fa-users mr-1" />
            Subscribers ({activity.headcount})
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const { currentUser } = this.props;
    const { activity, mySubscriber } = this.state;

    const onUpdateTag = canManageActivity(activity, currentUser) ? this.onUpdateTag : null;

    let $subscription = null;
    if (mySubscriber !== null) {
      $subscription = (
        <div className="alert alert-info">
          <i className="fas fa-info-circle mr-1" />
          You have already subscribed to this activity.
          <Link
            className="ml-2"
            to={subscriberDetailPath(mySubscriber)}
          >
            Click here to check your subscription.
          </Link>
        </div>
      );
    } else {
      $subscription = (
        <Link
          className="btn btn-primary btn-lg"
          to={subscriberCreatePath(activity)}
        >
          <i className="fas fa-hand-point-up mr-2" />
          I want to attend this activity!
        </Link>
      );
    }

    return (
      <div>

        {this.renderBreadcrumb()}

        <section>
          <h1>{activity.title}</h1>
          {this.renderToolbar()}
        </section>

        <div className="row">

          <div className="col-8">
            <section>
              <DangerousHTML html={activity.description} />
            </section>
            <section>
              {$subscription}
            </section>
          </div>

          <div className="col-4">
            <ActivitySidebar activity={activity} />
            <ActivityTagList activity={activity} onUpdate={onUpdateTag} />
          </div>

        </div>

      </div>
    );
  }
}


ActivityDetail.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  match: RouterPropTypes.match({
    activityPk: PropTypes.string.isRequired,
  }).isRequired,
};

ActivityDetail.defaultProps = {
  currentUser: null,
};
