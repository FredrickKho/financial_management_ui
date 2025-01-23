import {  NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clear } from '../store/reducers/ui';
import { logout } from '../store/reducers/auth';

const Sidebar = ({ user }) => {
	const date = useSelector((state) => state.ui.date);
	const time = useSelector((state) => state.ui.time);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const loggedout = async (event) => {
		event.preventDefault();
		try {
			const authResponse = await fetch(
				`${process.env.REACT_APP_API_URL}/api/auth/logout`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);
			console.log(authResponse)
			if (authResponse.ok) {
				window.toastr.success("Logout Success");
				localStorage.removeItem('account');
				localStorage.removeItem('expiredTime');
				dispatch(clear());
				dispatch(logout());
				navigate('/');
			} else {
				window.toastr.error("Logout error, call developer for help");
			}
		} catch (err) {
			console.error('Logout error:', err);
		}
	};
	return (
		<aside className="main-sidebar sidebar-dark-primary elevation-4">
			{/* <!-- Brand Logo --> */}
			<NavLink
				to="/dashboard"
				end
				className="brand-link text-center">
				<span className="brand-text font-weight-bold">Nelvonce</span>
			</NavLink>

			{/* <!-- Sidebar --> */}
			<div className="sidebar">
				{/* <!-- Sidebar user panel (optional) --> */}
				<div className="user-panel d-flex justify-content-center flex-column align-center">
					<div className="info">
						<p
							className="d-block"
							style={{ color: 'white' }}>
							Welcome, {user.firstname}
						</p>
					</div>
					<div className="info align-center">
						<p
							className="m-0"
							style={{ color: 'white' }}>
							{date}
						</p>
						<p
							className="m-0"
							style={{ color: 'white' }}>
							{time}
						</p>
					</div>
				</div>
				{/* <!-- Sidebar Menu --> */}
				<nav className="mt-2">
					<ul
						className="nav nav-pills nav-sidebar flex-column"
						data-widget="treeview"
						role="menu"
						data-accordion="false">
						<li className="nav-item">
							<NavLink
								to="/dashboard"
								end
								className={({ isActive }) =>
									isActive ? 'nav-link active' : 'nav-link'
								}>
								<i className="nav-icon fas fa-tachometer-alt"></i>
								<p>Dashboard</p>
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink
								to="/invoices"
								end
								className={({ isActive }) =>
									isActive ? 'nav-link active' : 'nav-link'
								}>
								<i className="nav-icon fas fa-table"></i>
								<p>Invoices</p>
							</NavLink>
						</li>
					</ul>
				</nav>
				<nav
					className="mt-2"
					style={{ position: 'relative', bottom: '-450px' }}>
					<ul
						className="nav nav-pills nav-sidebar flex-column"
						data-widget="treeview"
						role="menu"
						data-accordion="false">
						<li className="nav-item">
							{/* <NavLink
								to="/dashboard"
                                end
								className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                  }
                                >
								<p>Logout</p>
							</NavLink> */}
							<button
								className="btn btn-info w-100"
								onClick={loggedout}>
								Logout
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	);
};
export default Sidebar;
