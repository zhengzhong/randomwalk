import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';

import backend from './backend';
import { profileUpdatePath } from './paths';


export default class ProfileDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      profile: null,
      currentUser: null,
    };
  }

  componentDidMount() {
    this._loadData();
  }

  get username() {
    return this.props.match.params.username;
  }

  _loadData() {
    const promises = [
      backend.retrieveProfile(this.username),
      backend.retrieveMyProfile(),
    ];
    Promise.all(promises)
      .then(([profile, currentUser]) => {
        this.setState({
          status: 'loaded',
          profile: profile,
          currentUser: currentUser,
        });
      })
      .catch((error) => {
        this.setState({
          status: error,
        });
      });
  }

  _reloadData() {
    this.setState({ status: null }, () => this._loadData());
  }

  renderToolbar() {
    const { profile, currentUser } = this.state;
    if (!profile || !currentUser || profile.username !== currentUser.username) {
      return null;
    }
    return (
      <div className="btn-toolbar" role="toolbar">
        <div className="btn-group btn-group-sm mr-2">
          <Link
            className="btn btn-primary btn-light-primary"
            to={profileUpdatePath(profile)}
          >
            <i className="fas fa-edit mr-1" />
            Update my profile
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const { profile } = this.state;
    return (
      <div>
        <section>
          <h1>{profile.display_name || profile.username}</h1>
          {this.renderToolbar()}
        </section>
      </div>
    );
  }
}


ProfileDetail.propTypes = {
  match: RouterPropTypes.match({
    username: PropTypes.string.isRequired,
  }).isRequired,
};
