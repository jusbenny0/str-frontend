import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { signOut } from '../../../redux/user/userSlice';

export default function PrivateRoute() {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      dispatch(signOut());
    }
  }, [currentUser, dispatch]);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}