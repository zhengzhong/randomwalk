import React from 'react';
import PropTypes from 'prop-types';

import { addDays, format } from 'date-fns';
import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import PermissionDenied from '../components/PermissionDenied';
import Breadcrumb from '../components/Breadcrumb';

import AccountsPropTypes from '../accounts/prop-types';

import activitiesBackend from './backend';
import { homePath, activityDetailPath } from './paths';
import { canCreateActivity } from './permissions';
import ActivityForm from './ActivityForm';


const ISO_DATE_FORMAT = 'yyyy-MM-dd'; // ISO format accepted by date-fns.


export default class ActivityCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      group: null,
      activity: null,
      errors: null,
      isSubmitting: false,
      formKey: 0,
    };
    this.onCreate = this.onCreate.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this.reloadData();
    }
  }

  onCreate(activity) {
    this.setState({ isSubmitting: false }, () => {
      const { formKey } = this.state;
      const populatedActivity = Object.assign({}, activity, { group_slug: this.groupSlug });
      activitiesBackend.createActivity(populatedActivity)
        .then((savedActivity) => {
          const path = activityDetailPath(savedActivity);
          this.props.history.replace(path);
        })
        .catch((error) => {
          console.error(`Fail to create activity: ${error}`);
          this.setState({
            activity: activity,
            errors: error.data || { non_field_error: `Fail to create activity: ${error}` },
            isSubmitting: false,
            formKey: formKey + 1,
          });
        });
    });
  }

  get groupSlug() {
    return this.props.match.params.groupSlug;
  }

  loadData() {
    const { formKey } = this.state;
    activitiesBackend.retrieveGroup(this.groupSlug)
      .then((group) => {
        const oneWeekLater = addDays(new Date(), 7);
        const activity = {
          pk: null,
          title: '',
          description: '',
          scheduled_date: format(oneWeekLater, ISO_DATE_FORMAT),
          closing_date: format(oneWeekLater, ISO_DATE_FORMAT),
          address: '',
          max_headcount: null,
          base_price: 0,
          custom_subscription_fields: [],
          subscription_notice: '',
          accept_online_payment: false,
          is_published: false,
        };
        this.setState({
          status: 'ready',
          group: group,
          activity: activity,
          errors: null,
          isSubmitting: false,
          formKey: formKey + 1,
        });
      })
      .catch((error) => {
        this.setState({
          status: error,
        });
      });
  }

  reloadData() {
    this.setState({ status: null }, () => this.loadData());
  }

  // eslint-disable-next-line class-methods-use-this
  renderBreadcrumb() {
    const items = [
      {
        title: 'Home',
        path: homePath(),
      },
      {
        title: 'Create New Activity',
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
    if (!canCreateActivity(currentUser)) {
      return <PermissionDenied />;
    }

    const { group, activity, errors, isSubmitting, formKey } = this.state;
    return (
      <div>
        {this.renderBreadcrumb()}
        <h1 className="section">Create</h1>
        <ActivityForm
          key={formKey}
          activity={activity}
          errors={errors}
          onSave={this.onCreate}
          cancelLink={homePath(group)}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
}


ActivityCreate.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
  history: RouterPropTypes.history().isRequired,
  match: RouterPropTypes.match({
    groupSlug: PropTypes.string.isRequired,
    pk: PropTypes.string,
  }).isRequired,
};

ActivityCreate.defaultProps = {
  currentUser: null,
};
