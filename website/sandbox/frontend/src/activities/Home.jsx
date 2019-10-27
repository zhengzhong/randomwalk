import React from 'react';
import { Redirect } from 'react-router-dom';

import { activityListPath } from './paths';


export default function Home() {
  return <Redirect to={activityListPath('upcoming')} />;
}
