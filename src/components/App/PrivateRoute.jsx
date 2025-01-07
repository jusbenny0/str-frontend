import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { signOut } from '../../../redux/user/userSlice';

export default function PrivateRoute() {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify`, {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isValid) {
            setIsAuthenticated(true);
            return;
          }
        }

        setIsAuthenticated(false);
        dispatch(signOut());
      } catch (error) {
        console.error('Error during token verification:', error);
        setIsAuthenticated(false);
        dispatch(signOut());
      }
    };

    if (currentUser) {
      checkAuth();
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser, dispatch]);

  
  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
