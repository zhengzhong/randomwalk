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
import ActivitySidebar from './ActivitySidebar';
import SubscriberForm from './SubscriberForm';


export default class SubscriberCreate extends React.Component {
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
    this.onCreate = this.onCreate.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this._reloadData();
    }
  }

  onCreate(subscriber) {
    this.setState({ isSubmitting: true }, () => {
      const { activity, formKey } = this.state;
      activitiesBackend.createSubscriber(activity, subscriber)
        .then((savedSubscriber) => {
          const path = subscriberDetailPath(savedSubscriber);
          this.props.history.replace(path);
        })
        .catch((error) => {
          console.error(`Fail to create subscriber: ${error}`);
          this.setState({
            subscriber: subscriber,
            errors: error.data || { non_field_error: `Fail to subscribe: ${error}` },
            isSubmitting: false,
            formKey: formKey + 1,
          });
        });
    });
  }

  get activityPk() {
    return this.props.match.params.activityPk;
  }

  _loadData() {
    const { formKey } = this.state;
    const promises = [
      activitiesBackend.retrieveActivity(this.activityPk),
      activitiesBackend.retrieveMySubscriber(this.activityPk),
    ];
    Promise.all(promises)
      .then(([activity, mySubscriber]) => {
        if (mySubscriber !== null) {
          const path = subscriberDetailPath(mySubscriber);
          this.props.history.replace(path);
          return;
        }
        const { currentUser } = this.props;
        this.setState({
          status: 'ready',
          activity: activity,
          subscriber: {
            pk: null,
            real_name: currentUser ? currentUser.real_name : '',
            email: currentUser ? currentUser.email : '',
            phone_number: currentUser ? currentUser.phone_number : '',
            message: '',
            custom_fields: [],
          },
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
        title: 'Subscribe',
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
    if (!currentUser) {
      return <PermissionDenied />;
    }

    const { activity, subscriber, errors, isSubmitting, formKey } = this.state;
    return (
      <div>

        {this.renderBreadcrumb()}

        <section>
          <h1 className="lighter">Subscribe to {activity.title}</h1>
        </section>

        <div className="row">

          <div className="col-8">
            <SubscriberForm
              key={formKey}
              activity={activity}
              subscriber={subscriber}
              errors={errors}
              onSave={this.onCreate}
              cancelLink={activityDetailPath(activity)}
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


SubscriberCreate.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  history: RouterPropTypes.history().isRequired,
  match: RouterPropTypes.match({
    activityPk: PropTypes.string.isRequired,
  }).isRequired,
};

SubscriberCreate.defaultProps = {
  currentUser: null,
};
