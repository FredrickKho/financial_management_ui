import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';
const PublicRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.currentUser);
    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
}
export default PublicRoute