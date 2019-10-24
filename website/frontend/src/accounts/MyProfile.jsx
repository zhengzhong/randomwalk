import React from 'react';
import { Redirect } from 'react-router-dom';

import LoadingOrError from '../components/LoadingOrError';

import backend from './backend';
import { loginPath, profileDetailPath } from './paths';


export default class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      currentUser: null,
    };
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData() {
    backend.retrieveMyProfile()
      .then((currentUser) => {
        this.setState({
          status: 'loaded',
          currentUser: currentUser,
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

    const { currentUser } = this.state;
    if (!currentUser) {
      return <Redirect to={loginPath()} />;
    }
    return <Redirect to={profileDetailPath(currentUser)} />;
  }
}
