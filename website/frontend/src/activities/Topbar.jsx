import React from 'react';

import AccountsPropTypes from '../accounts/prop-types';

import { FRONTEND_URL_PREFIX } from '../settings';


function encodeNextUrl() {
  return encodeURIComponent(`${window.location.pathname}${window.location.search}${window.location.hash}`);
}

function loginPath() {
  const next = encodeNextUrl();
  return `${FRONTEND_URL_PREFIX}accounts/login?next=${next}`;
}

function logoutPath() {
  const next = encodeNextUrl();
  return `${FRONTEND_URL_PREFIX}accounts/logout?next=${next}`;
}

function myProfilePath() {
  return `${FRONTEND_URL_PREFIX}accounts/profile/my`;
}


export default class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onLogin(event) {
    event.preventDefault();
    window.location.href = loginPath();
  }

  // eslint-disable-next-line class-methods-use-this
  onLogout(event) {
    event.preventDefault();
    window.location.href = logoutPath();
  }

  // eslint-disable-next-line class-methods-use-this
  renderMainNav() {
    return (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a className="nav-link" href="#TODO">
            <i className="fas fa-rocket mr-1" />
            Jobs
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#TODO">
            <i className="fas fa-cogs mr-1" />
            Config Groups
          </a>
        </li>
      </ul>
    );
  }

  renderUserNav() {
    const { currentUser } = this.props;
    if (currentUser) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#null"
              role="button"
              data-toggle="dropdown"
            >
              <i className="fas fa-user mr-1" />
              {currentUser.display_name || currentUser.username}
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href={myProfilePath()}>
                <i className="fas fa-id-card mr-1" />
                Profile
              </a>
              <a className="dropdown-item" href="#logout" onClick={this.onLogout}>
                <i className="fas fa-sign-out-alt mr-1" />
                Logout
              </a>
              {currentUser.is_staff && (
                <React.Fragment>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="/_admin/" target="_blank">
                    <i className="fas fa-tools mr-1" />
                    Admin
                  </a>
                  <a className="dropdown-item" href="/restified/v3/_meta/swagger/" target="_blank">
                    <i className="fas fa-tools mr-1" />
                    Swagger
                  </a>
                </React.Fragment>
              )}
            </div>
          </li>
        </ul>
      );
    }

    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#login" onClick={this.onLogin}>
            <i className="fas fa-sign-in-alt mr-1" />
            Login
          </a>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <nav id="topbar" className="navbar navbar-expand-lg navbar-dark d-none d-sm-block">
        <div className="container-fluid">

          <a className="navbar-brand" href="/">
            {/*
            <img
              className="navbar-brand-logo"
              style={{ height: '32px' }}
              src="/img/logo-white.png"
              alt="Website Logo"
            />
            */}
            <span className="navbar-brand-text">Frontend</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#topbar-supported-content"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="topbar-supported-content" className="collapse navbar-collapse">
            {this.renderMainNav()}
            {this.renderUserNav()}
          </div>

        </div>
      </nav>
    );
  }
}


Topbar.propTypes = {
  currentUser: AccountsPropTypes.currentUser(),
};

Topbar.defaultProps = {
  currentUser: null,
};
