import React from 'react';
import queryString from 'query-string';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';

import backend from './backend';


export default class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      message: null,
    };
  }

  componentDidMount() {
    this._logout();
  }

  _logout() {
    backend.logout()
      .then(() => {
        console.log('Successfully logged out.');
        this.setState({ status: 'ready', message: 'Successfully logged out.' }, () => {
          const query = queryString.parse(this.props.location.search);
          const nextUrl = query.next || '/';
          window.location.replace(nextUrl);
        });
      })
      .catch((error) => {
        this.setState({
          status: error,
        });
      });
  }

  render() {
    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const { message } = this.state;
    return (
      <div className="alert alert-info">
        {message}
      </div>
    );
  }
}


Logout.propTypes = {
  location: RouterPropTypes.location().isRequired,
};
