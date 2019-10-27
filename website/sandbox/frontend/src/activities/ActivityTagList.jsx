import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ActivitiesPropTypes from './prop-types';
import { activityListByTagPath } from './paths';


export default class ActivityTagList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowNewTagInput: false,
      newTag: '',
    };
    this.onNewTagToggleClick = this.onNewTagToggleClick.bind(this);
    this.onNewTagInputKeyPress = this.onNewTagInputKeyPress.bind(this);
    this.onNewTagChange = this.onNewTagChange.bind(this);
    this.onAddTag = this.onAddTag.bind(this);
  }

  onNewTagToggleClick() {
    this.setState({ shouldShowNewTagInput: true });
  }

  onNewTagInputKeyPress(event) {
    // Call `onAddTag()` if user pressed the Enter key.
    // See: https://stackoverflow.com/a/31273404
    if (event.key === 'Enter') {
      this.onAddTag();
    }
  }

  onNewTagChange(event) {
    this.setState({ newTag: event.target.value });
  }

  onAddTag() {
    const { onUpdate } = this.props;
    if (onUpdate === null) {
      console.log('Updating tag is not supported.');
      return;
    }
    const tag = this.state.newTag.trim();
    if (tag) {
      this.setState({ newTag: '' }, () => onUpdate('create', tag));
    }
  }

  render() {
    const { activity, onUpdate } = this.props;
    const { shouldShowNewTagInput, newTag } = this.state;

    const $tagItems = activity.tag_list.map(tag => (
      <li key={tag} className="list-inline-item mr-2 mb-2">
        <span className="badge badge-lg badge-muted badge-outline">
          <Link
            className="text-reset text-decoration-none"
            to={activityListByTagPath(tag)}
          >
            <i className="fas fa-tag mr-1" />
            {tag}
          </Link>
          {onUpdate !== null && (
            <button
              className="anchor text-decoration-none text-muted ml-2"
              type="button"
              onClick={() => onUpdate('delete', tag)}
            >
              &times;
            </button>
          )}
        </span>
      </li>
    ));

    let $newTagToggleOrInput = null;
    if (onUpdate !== null) {
      const $newTagToggle = (
        <div>
          <button className="anchor" type="button" onClick={this.onNewTagToggleClick}>
            Add a new tag
          </button>
        </div>
      );
      const $newTagInput = (
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Tag"
            value={newTag}
            onChange={this.onNewTagChange}
            onKeyPress={this.onNewTagInputKeyPress}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.onAddTag}
            >
              Add
            </button>
          </div>
        </div>
      );
      $newTagToggleOrInput = shouldShowNewTagInput ? $newTagInput : $newTagToggle;
    }

    return (
      <section>
        <ul className="list-inline">
          {$tagItems}
        </ul>
        {$newTagToggleOrInput}
      </section>
    );
  }
}

ActivityTagList.propTypes = {
  activity: ActivitiesPropTypes.activity({ persisted: true }).isRequired,
  onUpdate: PropTypes.func,
};

ActivityTagList.defaultProps = {
  onUpdate: null,
};
