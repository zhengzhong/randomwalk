import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';

import ActivitiesPropTypes from './prop-types';


const ISO_DATE_FORMAT = 'yyyy-MM-dd'; // ISO format accepted by date-fns.


/**
 * A component allowing to edit activity date and location.
 */
export default function ActivityFormDateAndAddress({ activity, errors, onChange }) {
  // Define functions to convert between date and string, taking care of empty value.
  const parseDate = (stringValue) => {
    if (stringValue) {
      return parseISO(stringValue);
    }
    return null;
  };
  const formatDate = (dateValue) => {
    if (dateValue) {
      return format(dateValue, ISO_DATE_FORMAT);
    }
    return '';
  };

  return (
    <section>
      <h2 className="text-muted text-center">Date and Address</h2>
      <div className="form-row">
        <div className="form-group col-6">
          <label htmlFor="scheduled_date">Scheduled date</label>
          <DatePicker
            id="scheduled_date"
            className="form-control"
            selected={parseDate(activity.scheduled_date)}
            onChange={value => onChange('scheduled_date', formatDate(value))}
            dateFormat={ISO_DATE_FORMAT}
          />
          {errors && errors.scheduled_date && (
            <div className="field-error">{errors.scheduled_date}</div>
          )}
        </div>
        <div className="form-group col-6">
          <label htmlFor="closing_date">Closing date</label>
          <DatePicker
            id="closing_date"
            className="form-control"
            selected={parseDate(activity.closing_date)}
            onChange={value => onChange('closing_date', formatDate(value))}
            dateFormat={ISO_DATE_FORMAT}
          />
          {errors && errors.closing_date && (
            <div className="field-error">{errors.closing_date}</div>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          className="form-control"
          type="text"
          value={activity.address}
          onChange={event => onChange('address', event.target.value)}
        />
        {errors && errors.address && (
          <div className="field-error">{errors.address}</div>
        )}
      </div>
    </section>
  );
}


ActivityFormDateAndAddress.propTypes = {
  activity: ActivitiesPropTypes.activity({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

ActivityFormDateAndAddress.defaultProps = {
  errors: null,
};
