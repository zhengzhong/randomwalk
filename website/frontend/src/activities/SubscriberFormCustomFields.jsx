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
    <label htmlFor={fieldConfig.uniqueId}>
      {fieldConfig.title}
    </label>
  );
  let $input = null;
  if (fieldConfig.type === SINGLE_LINE_TEXT) {
    $input = (
      <input
        id={fieldConfig.uniqueId}
        className="form-control"
        type="text"
        value={customField.value}
        onChange={event => onChange(fieldConfig, event.target.value)}
      />
    );
  } else if (fieldConfig.type === MULTI_LINE_TEXT) {
    $input = (
      <textarea
        id={fieldConfig.uniqueId}
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
        id={fieldConfig.uniqueId}
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
    $label = null;
    $input = (
      <div className="form-group form-check">
        <input
          id={fieldConfig.uniqueId}
          className="form-check-input"
          type="checkbox"
          checked={customField.value === 'on'}
          onChange={event => onChange(fieldConfig, event.target.checked ? 'on' : 'off')}
        />
        <label htmlFor={fieldConfig.uniqueId} className="form-check-label">
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
    <div key={fieldConfig.uniqueId} className="form-group row">
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
  fieldConfig: PropTypes.shape({
    uniqueId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    required: PropTypes.bool.isRequired,
  }).isRequired,
  customField: PropTypes.shape({
    uniqueId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};


export default function SubscriberFormCustomFields({ activity, subscriber, errors, onChange }) {
  // Check if the activity has custom subscription fields.
  if (activity.custom_subscription_fields.length === 0) {
    return <React.Fragment />;
  }

  const onChangeCustomField = (fieldConfig, value) => {
    const customField = {
      uniqueId: fieldConfig.uniqueId,
      title: fieldConfig.title,
      value: value,
    };
    const customFields = subscriber.custom_fields
      .filter(item => item.uniqueId !== fieldConfig.uniqueId)
      .concat([customField]);
    onChange('custom_fields', customFields);
  };

  const $customFields = activity.custom_subscription_fields.map((fieldConfig) => {
    // Find or create a custom field on the subscriber.
    let customField = subscriber.custom_fields.find(item => item.uniqueId === fieldConfig.uniqueId);
    if (customField === undefined) {
      console.error(`Cannot find custom field ${fieldConfig.title} in subscriber.`);
      customField = {
        uniqueId: fieldConfig.uniqueId,
        title: fieldConfig.title,
        value: fieldConfig.type === CHECKBOX ? 'off' : '',
      };
    }
    // Render the custom field.
    return (
      <CustomField
        key={fieldConfig.uniqueId}
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
