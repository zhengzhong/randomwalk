import React from 'react';
import queryString from 'query-string';

import RouterPropTypes from '../common/router-prop-types';
import LoadingOrError from '../components/LoadingOrError';
import ErrorAlert from '../components/ErrorAlert';

import backend from './backend';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      username: '',
      password: '',
      isAuthenticating: false,
      authError: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  onChange(event, propName) {
    const value = event.target.value;
    this.setState({ [propName]: value });
  }

  onLogin() {
    this.setState({ isAuthenticating: true, authError: null }, () => {
      const { username, password } = this.state;
      backend.login(username, password)
        .then((data) => {
          console.log(`Authentication succeeded: ${JSON.stringify(data)}`);
          const query = queryString.parse(this.props.location.search);
          const nextUrl = query.next || '/';
          window.location.replace(nextUrl);
        })
        .catch((error) => {
          this.setState({
            password: '',
            isAuthenticating: false,
            authError: error,
          });
        });
    });
  }

  _loadData() {
    backend.retrieveMyProfile()
      .then((currentUser) => {
        let username = '';
        if (currentUser) {
          username = currentUser.username;
          console.log(`User ${username} is already authenticated`);
        }
        this.setState({
          status: 'loaded',
          username: username,
          password: '',
          isAuthenticating: false,
          authError: null,
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

    const { username, password, isAuthenticating, authError } = this.state;

    return (
      <div>

        <h1 className="section">Login</h1>

        <ErrorAlert error={authError} />

        <section>
          <div className="form-group">
            <label htmlFor="username">Username (or email)</label>
            <input
              id="username"
              className="form-control"
              type="text"
              placeholder="Username or email"
              value={username}
              onChange={event => this.onChange(event, 'username')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={event => this.onChange(event, 'password')}
            />
          </div>
          <button
            className="btn btn-primary"
            type="button"
            disabled={isAuthenticating}
            onClick={this.onLogin}
          >
            {isAuthenticating && (
              <span className="spinner-border spinner-border-sm mr-2" role="status" />
            )}
            Login
          </button>
        </section>

      </div>
    );
  }
}


Login.propTypes = {
  location: RouterPropTypes.location().isRequired,
};
