import { useAuth } from '../../utils/store';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, isLoading, getAuth } = useAuth();
  const [_, setLocation] = useLocation();
  if (!currentUser && !isLoading) {
    setLocation('/');
  }
  useEffect(() => {
    const interval = setInterval(() => {
      useAuth.setState({ isLoading: true });
      getAuth();
    }, 3600000);
    return () => clearInterval(interval);
  }, []);
  return <>{children}</>;
};
export default ProtectedRoute;
