import React from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import PermissionDenied from '../components/PermissionDenied';
import Breadcrumb from '../components/Breadcrumb';

import AccountsPropTypes from '../accounts/prop-types';

import activitiesBackend from './backend';
import { homePath, activityDetailPath, subscriberDetailPath } from './paths';
import { canUpdateSubscriber } from './permissions';
import ActivitySidebar from './ActivitySidebar';
import SubscriberForm from './SubscriberForm';


export default class SubscriberUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      activity: null,
      subscriber: null,
      errors: null,
      isSubmitting: false,
      formKey: 0,
    };
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this._reloadData();
    }
  }

  onUpdate(subscriber) {
    this.setState({ isSubmitting: true }, () => {
      const { formKey } = this.state;
      activitiesBackend.updateSubscriber(subscriber)
        .then((savedSubscriber) => {
          const path = subscriberDetailPath(savedSubscriber);
          this.props.history.replace(path);
        })
        .catch((error) => {
          console.error(`Fail to update subscriber: ${error}`);
          this.setState({
            subscriber: subscriber,
            errors: error.data || { non_field_error: `Fail to update subscriber: ${error}` },
            isSubmitting: false,
            formKey: formKey + 1,
          });
        });
    });
  }

  get activityPk() {
    return this.props.match.params.activityPk;
  }

  get subscriberPk() {
    return this.props.match.params.subscriberPk;
  }

  _loadData() {
    const { formKey } = this.state;
    const promises = [
      activitiesBackend.retrieveActivity(this.activityPk),
      activitiesBackend.retrieveSubscriber(this.activityPk, this.subscriberPk),
    ];
    Promise.all(promises)
      .then(([activity, subscriber]) => {
        this.setState({
          status: 'ready',
          activity: activity,
          subscriber: subscriber,
          errors: null,
          isSubmitting: false,
          formKey: formKey + 1,
        });
      })
      .catch((err) => {
        this.setState({
          status: err,
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
        path: subscriberDetailPath(subscriber),
      },
      {
        title: 'Update',
      },
    ];
    return <Breadcrumb items={items} />;
  }

  render() {
    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const { currentUser } = this.props;
    const { activity, subscriber, errors, isSubmitting, formKey } = this.state;
    if (!canUpdateSubscriber(subscriber, currentUser)) {
      return <PermissionDenied />;
    }

    return (
      <div>

        {this.renderBreadcrumb()}

        <h1 className="section">Update Subscription #{subscriber.pk}</h1>

        <div className="row">

          <div className="col-8">
            <SubscriberForm
              key={formKey}
              activity={activity}
              subscriber={subscriber}
              errors={errors}
              onSave={this.onUpdate}
              cancelLink={subscriberDetailPath(subscriber)}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="col-4">
            <ActivitySidebar activity={activity} />
          </div>
        </div>

      </div>
    );
  }
}


SubscriberUpdate.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  history: RouterPropTypes.history().isRequired,
  match: RouterPropTypes.match({
    activityPk: PropTypes.string.isRequired,
    subscriberPk: PropTypes.string.isRequired,
  }).isRequired,
};

SubscriberUpdate.defaultProps = {
  currentUser: null,
};
