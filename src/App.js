import './App.css';
import { Route, Routes } from 'react-router-dom';
import InvoicePage from './pages/InvoicePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import Template from './Template';
import { useEffect, useState } from 'react';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import store from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setExpired, setLoading } from './store/reducers/auth';
import Register from './pages/RegisterPage';

function App() {
	const currentUser = useSelector((state) => state.auth.currentUser);
	const dispatch = useDispatch();
	useEffect(() => {
		const savedAccount = localStorage.getItem('account');
		const savedExpiredTime = localStorage.getItem('expiredTime');
		dispatch(setLoading(true));
		if (savedAccount) {
			dispatch(login(savedAccount)); // Load user data from localStorage
		}

		if (savedExpiredTime) {
			dispatch(setExpired(savedExpiredTime)); // Set the session expiry time
		}
		dispatch(setLoading(false));
	}, [dispatch]);

	return (
		<Routes>
			<Route element={<PrivateRoute />}>
				<Route
					path="/dashboard"
					element={<Template Content={DashboardPage} />}
				/>
				<Route
					path="/invoices"
					element={<Template Content={InvoicePage} />}
				/>
			</Route>

			<Route element={<PublicRoute />}>
				<Route
					path="/"
					element={<LoginPage />}
				/>
				<Route
					path="/register"
					element={<Register />}
				/>
			</Route>
		</Routes>
	);
}

export default App;
