import React from 'react';
import PropTypes from 'prop-types';

import ActivitiesPropTypes from './prop-types';
import {
  SINGLE_LINE_TEXT,
  MULTI_LINE_TEXT,
  SINGLE_CHOICE_SELECT,
  CHECKBOX,
  parseFieldChoices,
} from './utils-subscription-fields';


function CustomField({ fieldConfig, customField, onChange }) {
  let $label = (
    <label htmlFor={fieldConfig.uid}>
      {fieldConfig.title}
    </label>
  );
  let $input = null;
  if (fieldConfig.type === SINGLE_LINE_TEXT) {
    $input = (
      <input
        id={fieldConfig.uid}
        className="form-control"
        type="text"
        value={customField.value}
        onChange={event => onChange(fieldConfig, event.target.value)}
      />
    );
  } else if (fieldConfig.type === MULTI_LINE_TEXT) {
    $input = (
      <textarea
        id={fieldConfig.uid}
        className="form-control"
        rows="8"
        value={customField.value}
        onChange={event => onChange(fieldConfig, event.target.value)}
      />
    );
  } else if (fieldConfig.type === SINGLE_CHOICE_SELECT) {
    const optionValues = parseFieldChoices(fieldConfig.choices);
    $input = (
      <select
        id={fieldConfig.uid}
        className="form-control"
        value={customField.value}
        onChange={event => onChange(fieldConfig, event.target.value)}
      >
        {optionValues.map(optionValue => (
          <option key={optionValue} value={optionValue}>
            {optionValue}
          </option>
        ))}
      </select>
    );
  } else if (fieldConfig.type === CHECKBOX) {
    // Checkbox has a different layout for its label.
    // If it's checked, its value is set to the field title. Otherwise, its value is 'NO'.
    $label = null;
    $input = (
      <div className="form-group form-check">
        <input
          id={fieldConfig.uid}
          className="form-check-input"
          type="checkbox"
          checked={customField.value === fieldConfig.title}
          onChange={event => onChange(fieldConfig, event.target.checked ? fieldConfig.title : 'NO')}
        />
        <label htmlFor={fieldConfig.uid} className="form-check-label">
          {fieldConfig.title}
        </label>
      </div>
    );
  }

  if ($input === null) {
    console.error(`Invalid type ${fieldConfig.type} for custom field ${fieldConfig.title}.`);
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div key={fieldConfig.uid} className="form-group row">
      <div className="col-sm-4">
        {$label}
      </div>
      <div className="col-sm-8">
        {$input}
      </div>
    </div>
  );
}

CustomField.propTypes = {
  fieldConfig: ActivitiesPropTypes.activityCustomSubscriptionField().isRequired,
  customField: ActivitiesPropTypes.subscriberCustomField().isRequired,
  onChange: PropTypes.func.isRequired,
};


export default function SubscriberFormCustomFields({ activity, subscriber, errors, onChange }) {
  // Check if the activity has custom subscription fields.
  if (activity.custom_subscription_fields.length === 0) {
    return <React.Fragment />;
  }

  const onChangeCustomField = (fieldConfig, value) => {
    const customField = {
      uid: fieldConfig.uid,
      title: fieldConfig.title,
      value: value,
    };
    const customFields = subscriber.custom_fields
      .filter(item => item.uid !== fieldConfig.uid)
      .concat([customField]);
    onChange('custom_fields', customFields);
  };

  const $customFields = activity.custom_subscription_fields.map((fieldConfig) => {
    // Find or create a custom field on the subscriber.
    let customField = subscriber.custom_fields.find(item => item.uid === fieldConfig.uid);
    if (customField === undefined) {
      console.error(`Cannot find custom field ${fieldConfig.title} in subscriber.`);
      customField = {
        uid: fieldConfig.uid,
        title: fieldConfig.title,
        value: fieldConfig.type === CHECKBOX ? 'off' : '',
      };
    }
    // Render the custom field.
    return (
      <CustomField
        key={fieldConfig.uid}
        fieldConfig={fieldConfig}
        customField={customField}
        onChange={onChangeCustomField}
      />
    );
  });

  return (
    <section>
      <h2 className="text-muted text-center">Additional Information</h2>
      <div className="alert alert-info">
        <i className="fas fa-info mr-1" />
        The activity organizers would like that you also provide the following information.
      </div>
      {$customFields}
      {errors && errors.custom_fields && (
        <div className="field-error">{errors.custom_fields}</div>
      )}
    </section>
  );
}


SubscriberFormCustomFields.propTypes = {
  activity: ActivitiesPropTypes.activity({ persisted: true }).isRequired,
  subscriber: ActivitiesPropTypes.subscriber({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

SubscriberFormCustomFields.defaultProps = {
  errors: null,
};
