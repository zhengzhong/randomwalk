import React from 'react';
import PropTypes from 'prop-types';

import { randomId } from '../common/utils';

import ActivityPropTypes from './prop-types';
import {
  SUBSCRIPTION_FIELD_CHOICES,
  SUBSCRIPTION_FIELD_TYPES,
  SINGLE_CHOICE_SELECT,
} from './utils-subscription-fields';


/**
 * A component for configuring a subscription field.
 */
function SubscriptionFieldConfig({ field, onMove, onDelete, onChange }) {
  if (!SUBSCRIPTION_FIELD_TYPES.includes(field.type)) {
    console.warn(`Invalid field type: ${field.type}`);
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div className="activity-subscription-field">

      <div className="d-flex mb-2">
        <div className="flex-grow-1">
          <i className="fas fa-edit mr-1" />
          {field.type}
        </div>
        <div className="btn-group btn-group-sm" role="group">
          <button
            className="btn btn-primary btn-light-primary"
            type="button"
            onClick={() => onMove(field, 'up')}
          >
            <i className="fas fa-caret-up" />
          </button>
          <button
            className="btn btn-primary btn-light-primary"
            type="button"
            onClick={() => onMove(field, 'down')}
          >
            <i className="fas fa-caret-down" />
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => onDelete(field)}
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor={`${field.uniqueId}_title`} className="col-sm-2 col-form-label">
          Title
        </label>
        <div className="col-sm-10">
          <input
            id={`${field.uniqueId}_title`}
            className="form-control"
            type="text"
            value={field.title}
            onChange={event => onChange(field, 'title', event.target.value)}
          />
        </div>
      </div>

      {field.type === SINGLE_CHOICE_SELECT && (
        <div className="form-group row">
          <label htmlFor={`${field.uniqueId}_choices`} className="col-sm-2 col-form-label">
            Choices
          </label>
          <div className="col-sm-10">
            <textarea
              id={`${field.uniqueId}_choices`}
              className="form-control"
              rows="8"
              value={field.choices}
              onChange={event => onChange(field, 'choices', event.target.value)}
            />
            <div className="field-help">Put one option per line.</div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-sm-2" />
        <div className="col-sm-10">
          <div className="form-group form-check">
            <input
              id={`${field.uniqueId}_required`}
              className="form-check-input"
              type="checkbox"
              checked={field.required}
              onChange={event => onChange(field, 'required', event.target.checked)}
            />
            <label htmlFor={`${field.uniqueId}_required`} className="form-check-label">
              This field is required.
            </label>
          </div>
        </div>
      </div>

    </div>
  );
}

SubscriptionFieldConfig.propTypes = {
  field: PropTypes.shape({
    uniqueId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    required: PropTypes.bool.isRequired,
  }).isRequired,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};


/**
 * A component for customizing activity subscription.
 */
export default function ActivityFormSubscription({ activity, errors, onChange }) {
  // Define operations on custom subscription fields.

  const onAddField = (type) => {
    const field = {
      uniqueId: randomId('field_'),
      type: type,
      title: '',
      choices: '',
      required: false,
    };
    const fields = activity.custom_subscription_fields.concat([field]);
    onChange('custom_subscription_fields', fields);
  };

  const onMoveField = (field, direction) => {
    const fields = activity.custom_subscription_fields.slice();
    const index = fields.findIndex(item => item.uniqueId === field.uniqueId);
    if (index < 0) {
      console.log(`Cannot find field with unique: ID ${field.uniqueId}`);
      return;
    }
    if (direction === 'up' && index - 1 >= 0) {
      fields[index] = fields[index - 1];
      fields[index - 1] = field;
    } else if (direction === 'down' && index + 1 < fields.length) {
      fields[index] = fields[index + 1];
      fields[index + 1] = field;
    }
    onChange('custom_subscription_fields', fields);
  };

  const onDeleteField = (field) => {
    const fields = activity.custom_subscription_fields
      .filter(item => item.uniqueId !== field.uniqueId);
    onChange('custom_subscription_fields', fields);
  };

  const onChangeField = (field, propName, value) => {
    const fields = activity.custom_subscription_fields.slice();
    const index = fields.findIndex(item => item.uniqueId === field.uniqueId);
    if (index < 0) {
      console.log(`Cannot find field with unique ID: ${field.uniqueId}`);
      return;
    }
    fields[index] = Object.assign({}, fields[index], { [propName]: value });
    onChange('custom_subscription_fields', fields);
  };

  return (
    <section>

      <h2 className="text-muted text-center">Subscription</h2>

      <div className="form-row">
        <div className="form-group col-6">
          <label htmlFor="max_headcount">Max Headcount</label>
          <input
            id="max_headcount"
            className="form-control"
            type="number"
            value={activity.max_headcount || ''}
            onChange={event => onChange('max_headcount', event.target.value)}
          />
          {errors && errors.max_headcount && (
            <div className="field-error">{errors.max_headcount}</div>
          )}
        </div>
        <div className="form-group col-6">
          <label htmlFor="base_price">Price (€)</label>
          <input
            id="base_price"
            className="form-control"
            type="number"
            value={activity.base_price}
            onChange={event => onChange('base_price', event.target.value)}
          />
          {errors && errors.base_price && (
            <div className="field-error">{errors.base_price}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <div className="label">Custom Subscription Fields</div>
        <div className="alert alert-info" role="alert">
          <i className="fas fa-info mr-1" />
          Choose and add a field type from the left pane.
        </div>
        <div className="row">
          <div className="col-8">
            {activity.custom_subscription_fields.map(field => (
              <SubscriptionFieldConfig
                key={field.uniqueId}
                field={field}
                onMove={onMoveField}
                onDelete={onDeleteField}
                onChange={onChangeField}
              />
            ))}
            {errors && errors.custom_subscription_fields && (
              <div className="field-error">{errors.custom_subscription_fields}</div>
            )}
          </div>
          <div className="col-4">
            <div className="list-group">
              {SUBSCRIPTION_FIELD_CHOICES.map(({ type, name, description }) => (
                <div key={type} className="list-group-item">
                  <h5 className="mb-1">{name}</h5>
                  <p className="mb-1">{description}</p>
                  <button
                    className="anchor text-sm"
                    type="button"
                    onClick={() => onAddField(type)}
                  >
                    <i className="fas fa-plus mr-1" />
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="subscription_notice">Subscription Notice</label>
        <textarea
          id="subscription_notice"
          className="form-control"
          rows="8"
          value={activity.subscription_notice}
          onChange={event => onChange('subscription_notice', event.target.value)}
        />
        {errors && errors.subscription_notice && (
          <div className="field-error">{errors.subscription_notice}</div>
        )}
      </div>

      <div className="form-group form-check">
        <input
          id="accept_online_payment"
          className="form-check-input"
          type="checkbox"
          checked={activity.accept_online_payment}
          onChange={event => onChange('accept_online_payment', event.target.checked)}
        />
        <label htmlFor="accept_online_payment" className="form-check-label">
          Accept online payment
        </label>
        {errors && errors.accept_online_payment && (
          <div className="field-error">{errors.accept_online_payment}</div>
        )}
      </div>
    </section>
  );
}


ActivityFormSubscription.propTypes = {
  activity: ActivityPropTypes.activity({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

ActivityFormSubscription.defaultProps = {
  errors: null,
};
