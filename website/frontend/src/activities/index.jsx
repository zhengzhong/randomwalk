import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LoadingOrError from '../components/LoadingOrError';

import '../components/style.scss';

import accountsBackend from '../accounts/backend';

import Topbar from './Topbar';

import Home from './Home';
import ActivityCreate from './ActivityCreate';
import ActivityDetail from './ActivityDetail';
import ActivityUpdate from './ActivityUpdate';
import ActivityList from './ActivityList';
import ActivityListByTag from './ActivityListByTag';

import SubscriberCreate from './SubscriberCreate';
import SubscriberDetail from './SubscriberDetail';
import SubscriberUpdate from './SubscriberUpdate';
import SubscriberList from './SubscriberList';

import './style.scss';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      currentUser: null,
    };
  }

  componentDidMount() {
    document.title = 'Activities';
    this.loadData();
  }

  loadData() {
    accountsBackend.retrieveMyProfile()
      .then((currentUser) => {
        this.setState({
          status: 'ready',
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
    if (!window.appRouterBasename) {
      console.error('Cannot find router basename (`window.appRouterBasename`).');
      return (
        <div className="alert alert-danger">
          Application is not properly configured: Cannot find router basename.
        </div>
      );
    }

    const { status } = this.state;
    if (status === null || status instanceof Error) {
      return <LoadingOrError status={status} />;
    }

    const basename = window.appRouterBasename;
    const { currentUser } = this.state;

    const renderHome = props => <Home {...props} currentUser={currentUser} />;

    const renderActivityCreate = props => <ActivityCreate {...props} currentUser={currentUser} />;
    const renderActivityDetail = props => <ActivityDetail {...props} currentUser={currentUser} />;
    const renderActivityUpdate = props => <ActivityUpdate {...props} currentUser={currentUser} />;
    const renderActivityList = props => <ActivityList {...props} currentUser={currentUser} />;
    const renderActivityListByTag = props => <ActivityListByTag {...props} currentUser={currentUser} />;

    const renderSubscriberCreate = props => <SubscriberCreate {...props} currentUser={currentUser} />;
    const renderSubscriberDetail = props => <SubscriberDetail {...props} currentUser={currentUser} />;
    const renderSubscriberUpdate = props => <SubscriberUpdate {...props} currentUser={currentUser} />;
    const renderSubscriberList = props => <SubscriberList {...props} currentUser={currentUser} />;

    return (
      <React.Fragment>
        <Topbar currentUser={currentUser} />
        <BrowserRouter basename={basename}>
          <div id="main" className="container">

            <Switch>

              <Route exact path="/" render={renderHome} />

              <Route exact path="/activity/create/:groupSlug" render={renderActivityCreate} />
              <Route exact path="/activity/detail/:activityPk" render={renderActivityDetail} />
              <Route exact path="/activity/update/:activityPk" render={renderActivityUpdate} />
              <Route exact path="/activity/list/:scheduled" render={renderActivityList} />
              <Route exact path="/activity/tag/:tag" render={renderActivityListByTag} />

              <Route exact path="/subscriber/create/:activityPk" render={renderSubscriberCreate} />
              <Route exact path="/subscriber/detail/:activityPk/:subscriberPk" render={renderSubscriberDetail} />
              <Route exact path="/subscriber/update/:activityPk/:subscriberPk" render={renderSubscriberUpdate} />
              <Route exact path="/subscriber/list/:activityPk" render={renderSubscriberList} />

            </Switch>

          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}


const mountNode = document.getElementById('app');

ReactDOM.render(<Index />, mountNode);
