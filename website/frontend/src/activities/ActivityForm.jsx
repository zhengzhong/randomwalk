import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { cloneDeep, isEmpty } from 'lodash';

import ActivityFormTitleAndDescription from './ActivityFormTitleAndDescription';
import ActivityFormDateAndAddress from './ActivityFormDateAndAddress';
import ActivityFormSubscription from './ActivityFormSubscription';
import ActivitiesPropTypes from './prop-types';
import {
  SUBSCRIPTION_FIELD_TYPES,
  SINGLE_CHOICE_SELECT,
  parseFieldChoices,
} from './utils-subscription-fields';


function cloneAndCleanActivity(activity) {
  const cloned = cloneDeep(activity);
  // Clean custom subscription fields by ignoring invalid field types.
  cloned.custom_subscription_fields = cloned.custom_subscription_fields
    .filter(item => SUBSCRIPTION_FIELD_TYPES.includes(item.type));
  return cloned;
}


function convertToInt(value, nullOrEmptyValue = NaN) {
  if (value === null) {
    return nullOrEmptyValue;
  }
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return nullOrEmptyValue;
    }
    return Math.floor(parseInt(value, 10));
  }
  // Not null, not empty, not a number.
  return NaN;
}


function validateActivity(activity) {
  const cleaned = Object.assign(cloneDeep(activity), {
    title: activity.title.trim(),
    description: activity.description.trim(),
    scheduled_date: activity.scheduled_date.trim(),
    closing_date: activity.closing_date.trim(),
    max_headcount: convertToInt(activity.max_headcount, 0),
    base_price: convertToInt(activity.base_price, 0),
    subscription_notice: activity.subscription_notice.trim(),
  });
  const errors = {};

  if (!cleaned.title) {
    errors.title = 'Activity title is required.';
  }
  if (!cleaned.description) {
    errors.description = 'Activity description is required.';
  }
  if (!cleaned.scheduled_date) {
    errors.scheduled_date = 'Scheduled date is required.';
  }
  if (Number.isNaN(cleaned.max_headcount) || cleaned.max_headcount < 0) {
    errors.max_headcount = 'Max headcount must be blank or non-negative.';
  }
  if (Number.isNaN(cleaned.base_price) || cleaned.base_price < 0) {
    errors.base_price = 'Base price must be non-negative.';
  }

  let numInvalidFields = 0;
  for (let i = 0; i < cleaned.custom_subscription_fields.length; i++) {
    const field = cleaned.custom_subscription_fields[i];
    let isValid = true;
    if (!field.title.trim()) {
      isValid = false;
    }
    if (field.type === SINGLE_CHOICE_SELECT) {
      const choices = parseFieldChoices(field.choices);
      if (choices.length === 0) {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      numInvalidFields += 1;
    }
  }
  if (numInvalidFields > 0) {
    errors.custom_subscription_fields = `${numInvalidFields} custom subscription fields are invalid.`;
  }

  return { cleaned, errors };
}


/**
 * Renders a form for editing an activity.
 */
export default class ActivityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: cloneAndCleanActivity(props.activity),
      errors: cloneDeep(props.errors),
    };
    this.onChangeProp = this.onChangeProp.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeProp(name, value) {
    this.setState((prevState) => {
      const activity = Object.assign({}, prevState.activity, { [name]: value });
      return { activity };
    });
  }

  onSubmit() {
    const { activity } = this.state;
    Promise.resolve(validateActivity(activity))
      .then(({ cleaned, errors }) => {
        this.setState({ errors }, () => {
          if (isEmpty(errors)) {
            this.props.onSave(cleaned);
          }
        });
      });
  }

  render() {
    const { isSubmitting, cancelLink } = this.props;
    const { activity, errors } = this.state;
    return (
      <React.Fragment>

        <ActivityFormTitleAndDescription
          activity={activity}
          errors={errors}
          initialDescription={this.props.activity.description}
          onChange={this.onChangeProp}
        />
        <ActivityFormDateAndAddress
          activity={activity}
          errors={errors}
          onChange={this.onChangeProp}
        />
        <ActivityFormSubscription
          activity={activity}
          errors={errors}
          onChange={this.onChangeProp}
        />

        <section>
          {!isEmpty(errors) && (
            <div className="alert alert-danger">
              <span className="mr-1">
                {errors.non_field_error || 'Form is invalid'}.
              </span>
              Please fix the errors and try again.
            </div>
          )}
          <div className="form-group">
            <button
              className="btn btn-primary mr-2"
              type="button"
              disabled={isSubmitting}
              onClick={this.onSubmit}
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-2" role="status" />
              )}
              {activity.pk === null ? 'Publish' : 'Update'}
            </button>
            <Link className="btn btn-light mr-2" to={cancelLink}>
              Cancel
            </Link>
          </div>
        </section>

      </React.Fragment>
    );
  }
}


ActivityForm.propTypes = {
  activity: ActivitiesPropTypes.activity({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  onSave: PropTypes.func.isRequired,
  cancelLink: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
};

ActivityForm.defaultProps = {
  errors: null,
  isSubmitting: false,
};
