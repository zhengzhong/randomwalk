import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import ActivityCreate from './ActivityCreate';


function Index() {
  document.title = 'Activities';

  if (!window.appRouterBasename) {
    console.error('Cannot find router basename (`window.appRouterBasename`).');
    return <div />;
  }

  const basename = window.appRouterBasename;
  return (
    <BrowserRouter basename={basename}>
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/activity/create/:groupSlug" component={ActivityCreate} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}


const mountNode = document.getElementById('app');

ReactDOM.render(<Index />, mountNode);
