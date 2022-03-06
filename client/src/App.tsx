import React from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import { Switch, Route } from 'wouter';
import Body from './components/LandingPage/Body';

const App = () => {
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/next" component={Body} />
      </Switch>
    </>
  );
};
export default App;
