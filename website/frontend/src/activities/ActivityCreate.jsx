import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import RouterPropTypes from '../common/router-prop-types';
import ErrorAlert from '../components/ErrorAlert';
import Spinner from '../components/Spinner';

import activitiesBackend from './backend';


export default class ActivityCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      group: null,
      activity: null,
    };
    this.onChangeActivityProp = this.onChangeActivityProp.bind(this);
    this.onSaveActivity = this.onSaveActivity.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this._reloadData();
    }
  }

  onChangeActivityProp(event, propName) {
    const value = event.target.value;
    this.setState((prevState) => {
      const activity = Object.assign({}, prevState.activity, { [propName]: value });
      return { activity };
    });
  }

  onSaveActivity() {
    const { activity } = this.state;
    console.log(`Saving activity: ${JSON.stringify(activity)}`);
    activitiesBackend.createActivity(this.groupSlug, activity)
      .then((activity) => {
        console.log('Done.');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  get groupSlug() {
    return this.props.match.params.groupSlug;
  }

  _loadData() {
    activitiesBackend.getGroup(this.groupSlug)
      .then((group) => {
        this.setState({
          status: 'loaded',
          group: group,
          activity: {
            title: '',
            description: '',
            scheduled_date: '2019-09-07',
            address: '',
          },
        });
      })
      .catch((err) => {
        this.setState({
          status: err,
          group: null,
          activity: null,
        });
      });
  }

  _reloadData() {
    this.setState({ status: null }, () => this._loadData());
  }

  render() {
    const { status, group, activity } = this.state;

    if (status === null) {
      return <Spinner />;
    }

    if (status instanceof Error) {
      return <ErrorAlert error={status} />;
    }

    return (
      <div>

        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">{group.name}</li>
          </ol>
        </nav>
        <h1 className="lighter">Create a new activity</h1>

        <section>

          <div className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Activity Title"
              value={activity.title}
              onChange={event => this.onChangeActivityProp(event, 'title')}
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="scheduled_date">Scheduled date</label>
              <input
                id="scheduled_date"
                className="form-control"
                type="text"
                placeholder="Date"
              />
            </div>
            <div className="form-group col-md-8">
              <label htmlFor="address">Location</label>
              <input
                id="address"
                className="form-control"
                type="text"
                placeholder="Location"
                value={activity.address}
                onChange={event => this.onChangeActivityProp(event, 'address')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              rows="10"
              placeholder="Description"
              value={activity.description}
              onChange={event => this.onChangeActivityProp(event, 'description')}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary" type="button" onClick={this.onSaveActivity}>
              Save
            </button>
          </div>

        </section>

      </div>
    );
  }
}


ActivityCreate.propTypes = {
  match: RouterPropTypes.match({ groupSlug: PropTypes.string.isRequired }).isRequired,
};
