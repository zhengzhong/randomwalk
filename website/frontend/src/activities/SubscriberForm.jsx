import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { cloneDeep, isEmpty } from 'lodash';

import SubscriberFormBasicInformation from './SubscriberFormBasicInformation';
import SubscriberFormCustomFields from './SubscriberFormCustomFields';
import ActivitiesPropTypes from './prop-types';
import { CHECKBOX } from './utils-subscription-fields';


function cloneAndCleanSubscriber(subscriber, activity) {
  const cloned = cloneDeep(subscriber);
  // Clean custom fields against the field configs defined in the activity.
  const customFields = [];
  for (let i = 0; i < activity.custom_subscription_fields.length; i++) {
    const fieldConfig = activity.custom_subscription_fields[i];
    let customField = subscriber.custom_fields
      .find(item => item.uid === fieldConfig.uid);
    if (customField === undefined) {
      customField = {
        uid: fieldConfig.uid,
        title: fieldConfig.title,
        value: fieldConfig.type === CHECKBOX ? 'off' : '',
      };
    }
    customFields.push(customField);
  }
  cloned.custom_fields = customFields;
  return cloned;
}


export default class SubscriberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriber: cloneAndCleanSubscriber(props.subscriber, props.activity),
      errors: cloneDeep(props.errors),
    };
    this.onChangeProp = this.onChangeProp.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  onChangeProp(name, value) {
    this.setState((prevState) => {
      const subscriber = Object.assign({}, prevState.subscriber, { [name]: value });
      return { subscriber };
    });
  }

  onSubmit() {
    const { subscriber } = this.state;
    Promise.resolve(this.validate(subscriber))
      .then(({ cleaned, errors }) => {
        this.setState({ errors }, () => {
          if (isEmpty(errors)) {
            this.props.onSave(cleaned);
          }
        });
      });
  }

  validate(subscriber) {
    const cleaned = Object.assign(cloneDeep(subscriber), {
      real_name: subscriber.real_name.trim(),
      email: subscriber.email.trim(),
      phone_number: subscriber.phone_number.trim(),
      message: subscriber.message.trim(),
    });
    const errors = {};

    if (!cleaned.real_name) {
      errors.real_name = 'Real name is required.';
    }
    if (!cleaned.email) {
      errors.email = 'Email is required.';
    }
    if (!cleaned.phone_number) {
      errors.phone_number = 'Phone number is required.';
    }

    // Validate custom fields.
    const invalidCustomFieldTitles = [];
    const { activity } = this.props;
    for (let i = 0; i < activity.custom_subscription_fields.length; i++) {
      const fieldConfig = activity.custom_subscription_fields[i];
      const customField = cleaned.custom_fields.find(item => item.uid === fieldConfig.uid);
      // Check if the current custom field is valid.
      let isValid = true;
      if (customField === undefined) {
        isValid = false;
      } else if (fieldConfig.required) {
        if (fieldConfig.type === CHECKBOX) {
          // Required checkbox must be checked, so its value should be the same as the field title.
          isValid = (customField.value === fieldConfig.title);
        } else {
          isValid = customField.value.trim() !== '';
        }
      }
      // If it's invalid, memorize the title of the field.
      if (!isValid) {
        invalidCustomFieldTitles.push(fieldConfig.title);
      }
    }
    if (invalidCustomFieldTitles.length > 0) {
      errors.custom_fields = `Fields ${invalidCustomFieldTitles.join(', ')} are invalid.`;
    }

    return { cleaned, errors };
  }

  render() {
    const { activity, cancelLink, isSubmitting } = this.props;
    const { subscriber, errors } = this.state;

    return (
      <React.Fragment>
        <SubscriberFormBasicInformation
          subscriber={subscriber}
          errors={errors}
          onChange={this.onChangeProp}
        />
        <SubscriberFormCustomFields
          activity={activity}
          subscriber={subscriber}
          errors={errors}
          onChange={this.onChangeProp}
        />
        <section>
          <div className="form-group row">
            <div className="col-sm-4" />
            <div className="col-sm-8">
              <button
                className="btn btn-primary mr-2"
                type="button"
                disabled={isSubmitting}
                onClick={this.onSubmit}
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-2" role="status" />
                )}
                {subscriber.pk === null ? 'Subscribe' : 'Update'}
              </button>
              <Link
                className="btn btn-light mr-2"
                to={cancelLink}
              >
                Cancel
              </Link>
            </div>
          </div>
        </section>

      </React.Fragment>
    );
  }
}


SubscriberForm.propTypes = {
  activity: ActivitiesPropTypes.activity({ persisted: true }).isRequired,
  subscriber: ActivitiesPropTypes.subscriber({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  onSave: PropTypes.func.isRequired,
  cancelLink: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
};

SubscriberForm.defaultProps = {
  errors: null,
  isSubmitting: false,
};
