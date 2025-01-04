import { Link, NavLink } from 'react-router-dom';
import store from '../store/store';
import { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Sidebar = ({user}) => {
	const date = useSelector((state) => state.ui.date);
	const time = useSelector((state) => state.ui.time);
	return (
		<aside className="main-sidebar sidebar-dark-primary elevation-4">
			{/* <!-- Brand Logo --> */}
			<a
				href="index3.html"
				className="brand-link text-center">
				<span className="brand-text font-weight-bold">Notance</span>
			</a>

			{/* <!-- Sidebar --> */}
			<div className="sidebar">
				{/* <!-- Sidebar user panel (optional) --> */}
				<div className="user-panel d-flex justify-content-center flex-column align-center">
					<div className="info">
						<p
							className="d-block"
							style={{color:"white"}}>
							Welcome, {user.firstname}
						</p>
					</div>
					<div className="info align-center">
						<p
							className="m-0"
							style={{color:"white"}}>
							{date}
						</p>
						<p
							className="m-0"
							style={{color:"white"}}>
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
                                  }
                                >
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
                                  }
                                >
								<i className="nav-icon fas fa-table"></i>
								<p>Invoices</p>
							</NavLink>
						</li>
					</ul>
				</nav>
				<nav className="mt-2" style={{position:"relative",bottom:"-450px"}}>
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
							<button className='btn btn-info w-100'>
								Logout
							</button>
						</li>
					</ul>
				</nav>
				
			</div>
		</aside>
	)
}
export default Sidebar;
