import React from 'react';
import PropTypes from 'prop-types';

import ActivitiesPropTypes from './prop-types';


export default function SubscriberFormBasicInformation({ subscriber, errors, onChange }) {
  return (
    <section>
      <h2 className="text-muted text-center">Basic Information</h2>
      <div className="form-group row">
        <label htmlFor="real_name" className="col-sm-4 col-form-label">Real Name</label>
        <div className="col-sm-8">
          <input
            id="real_name"
            className="form-control"
            type="text"
            value={subscriber.real_name}
            onChange={event => onChange('real_name', event.target.value)}
          />
          {errors && errors.real_name && (
            <div className="field-error">{errors.real_name}</div>
          )}
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="email" className="col-sm-4 col-form-label">Email</label>
        <div className="col-sm-8">
          <input
            id="email"
            className="form-control"
            name="email"
            type="text"
            value={subscriber.email}
            onChange={event => onChange('email', event.target.value)}
          />
          {errors && errors.email && (
            <div className="field-error">{errors.email}</div>
          )}
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="phone_number" className="col-sm-4 col-form-label">Phone Number</label>
        <div className="col-sm-8">
          <input
            id="phone_number"
            className="form-control"
            name="phone_number"
            type="text"
            value={subscriber.phone_number}
            onChange={event => onChange('phone_number', event.target.value)}
          />
          {errors && errors.phone_number && (
            <div className="field-error">{errors.phone_number}</div>
          )}
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="message" className="col-sm-4 col-form-label">Your Message</label>
        <div className="col-sm-8">
          <textarea
            id="message"
            className="form-control"
            rows="8"
            name="message"
            value={subscriber.message}
            onChange={event => onChange('message', event.target.value)}
          />
          <div className="field-help">
            You may leave a message to the activity organizers. This field is optional.
          </div>
          {errors && errors.message && (
            <div className="field-error">{errors.message}</div>
          )}
        </div>
      </div>
    </section>
  );
}


SubscriberFormBasicInformation.propTypes = {
  subscriber: ActivitiesPropTypes.subscriber({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

SubscriberFormBasicInformation.defaultProps = {
  errors: null,
};
