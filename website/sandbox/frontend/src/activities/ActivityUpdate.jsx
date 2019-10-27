import React from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import PermissionDenied from '../components/PermissionDenied';
import Breadcrumb from '../components/Breadcrumb';

import AccountsPropTypes from '../accounts/prop-types';

import { homePath, activityDetailPath } from './paths';
import { canManageActivity } from './permissions';
import ActivityForm from './ActivityForm';
import activitiesBackend from './backend';


export default class ActivityUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      activity: null,
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

  onUpdate(activity) {
    this.setState({ isSubmitting: true }, () => {
      const { formKey } = this.state;
      activitiesBackend.updateActivity(activity)
        .then((savedActivity) => {
          const path = activityDetailPath(savedActivity);
          this.props.history.replace(path);
        })
        .catch((error) => {
          console.error(`Fail to update activity: ${error}`);
          this.setState({
            activity: activity,
            errors: error.data || { non_field_error: `Fail to update activity: ${error}` },
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
    activitiesBackend.retrieveActivity(this.activityPk)
      .then((activity) => {
        this.setState({
          status: 'ready',
          activity: activity,
          isSubmitting: false,
          errors: null,
          formKey: formKey + 1,
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
    const { activity, errors, isSubmitting, formKey } = this.state;

    if (!canManageActivity(activity, currentUser)) {
      return <PermissionDenied />;
    }

    return (
      <div>
        {this.renderBreadcrumb()}
        <section>
          <h1>Update: {activity.title}</h1>
        </section>
        <ActivityForm
          key={formKey}
          activity={activity}
          errors={errors}
          onSave={this.onUpdate}
          cancelLink={activityDetailPath(activity)}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
}


ActivityUpdate.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  history: RouterPropTypes.history().isRequired,
  match: RouterPropTypes.match({
    activityPk: PropTypes.string,
  }).isRequired,
};

ActivityUpdate.defaultProps = {
  currentUser: null,
};
