import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './Login';
import Logout from './Logout';
import MyProfile from './MyProfile';
import ProfileDetail from './ProfileDetail';

import '../components/style.scss';


function Index() {
  document.title = 'Accounts';

  if (!window.appRouterBasename) {
    console.error('Cannot find router basename (`window.appRouterBasename`).');
    return <div />;
  }

  const basename = window.appRouterBasename;
  return (
    <BrowserRouter basename={basename}>
      <div className="container">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/profile/my" component={MyProfile} />
          <Route exact path="/profile/detail/:username" component={ProfileDetail} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}


const mountNode = document.getElementById('app');

ReactDOM.render(<Index />, mountNode);
