import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import store from './store/store';
import { setTime,setDate, clear } from './store/reducers/ui';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from './store/reducers/auth';
import { Navigate, useNavigate } from 'react-router-dom';

const Template = ({ Content }) => {
	const [user,setUser] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const getUser = () => {
		const jsonUser = JSON.stringify(store.getState().auth.currentUser);
		setUser(JSON.parse(jsonUser))
	}
	const checkSession = () => {
		const currentTime = new Date();
		const expiredTime = new Date(localStorage.getItem("expiredTime"));
		// console.log("expired : ",expiredTime)
		// console.log(currentTime == expiredTime)
		// console.log(localStorage.getItem("expiredTime"))
		if (currentTime > expiredTime && localStorage.getItem("expiredTime")) {
			localStorage.removeItem("account")
			localStorage.removeItem("expiredTime")
			dispatch(clear())
			dispatch(logout())
			window.toastr.error("Session Timeout")
			navigate("/")
		}
	}
	const updateTimeAndDate = () => {
		const now = new Date();
  
		// Format the date to "Fri, 03 Jan 2025"
		const formattedDate = now.toLocaleDateString('en-GB', {
		  weekday: 'short',
		  day: '2-digit',
		  month: 'short',
		  year: 'numeric',
		});
  
		// Format the time to "08:40:55"
		const formattedTime = now.toLocaleTimeString('en-GB', {
		  hour: '2-digit',
		  minute: '2-digit',
		  second: '2-digit',
		});
		checkSession()
		dispatch(setDate(formattedDate));
		dispatch(setTime(formattedTime));
	  }

	useEffect(() => {
		// Update time and date every second
		const intervalId = setInterval(updateTimeAndDate, 1000);
		// Cleanup the interval when the component is unmounted
		return () => clearInterval(intervalId);
	},[dispatch])

	useEffect(()=>{
		getUser();
		// console.log(user)
	},[])
	const date = useSelector((state) => state.ui.date);
	const time = useSelector((state) => state.ui.time);
	if (!user || !date || !time) {
		// You can return a loading spinner or something else until the user is fetched
		return (
			<div className="content-wrapper d-flex justify-content-center flex-column align-items-center">
				<div
					className="spinner-border"
					role="status">
					<span className="visually-hidden"></span>
				</div>
			</div>
		);
	  }
	return (
		<div className="wrapper">
			{/* {console.log(user.firstname)} */}
			<Header></Header>
			<Sidebar user={user}></Sidebar>
			<Content></Content>
			<Footer></Footer>
		</div>
	);
};
export default Template;
