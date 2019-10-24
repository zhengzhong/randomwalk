import React from 'react';
import PropTypes from 'prop-types';

import RichTextEditor from '../components/RichTextEditor';

import ActivitiesPropTypes from './prop-types';


/**
 * A component allowing to edit activity title and description.
 *
 * NOTE: We need to pass an immutable initial description HTML to the rich-text editor, so that its
 * value will NOT change as `activity` is updated. This will prevent the editor from refreshing
 * (thus putting cursor at the beginning of the edit area).
 */
export default function ActivityFormTitleAndDescription({
  activity,
  errors,
  initialDescription,
  onChange,
}) {
  return (
    <section>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="form-control form-control-xl"
          type="text"
          placeholder="Title"
          value={activity.title}
          onChange={event => onChange('title', event.target.value)}
        />
        {errors && errors.title && <div className="field-error">{errors.title}</div>}
      </div>
      <div className="form-group">
        <div className="label">Description</div>
        <RichTextEditor
          initialHTML={initialDescription}
          onChange={value => onChange('description', value)}
        />
        {errors && errors.description && <div className="field-error">{errors.description}</div>}
      </div>
    </section>
  );
}


ActivityFormTitleAndDescription.propTypes = {
  activity: ActivitiesPropTypes.activity({ persisted: false }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
  initialDescription: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

ActivityFormTitleAndDescription.defaultProps = {
  errors: null,
};
