import React, { useEffect } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Switch, Route } from 'wouter';
import { useAuth } from './utils/store';

const App = () => {
  const { getAuth, currentUser, isLoading } = useAuth();
  useEffect(() => {
    useAuth.setState({ isLoading: true });
    getAuth();
  }, []);
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
      </Switch>
    </>
  );
};
export default App;
