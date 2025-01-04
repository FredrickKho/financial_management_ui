import { Navigate, Outlet } from 'react-router-dom';
import store, { useAppSelector } from '../store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/reducers/auth';
const PrivateRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.currentUser);
    const isLoading = useAppSelector((state) => state.auth.isLoading);
    if (isLoading) {
        return <div>Loading...</div>; // Or display a loading spinner
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
export default PrivateRoute