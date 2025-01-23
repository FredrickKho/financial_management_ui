import { useCallback, useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { setTime,setDate, clear } from './store/reducers/ui';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from './store/reducers/auth';
import { useNavigate } from 'react-router-dom';

const Template = ({ Content }) => {
	const [user,setUser] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const getUser = async () => {
		try {
			const accResponse = await fetch(
				`${process.env.REACT_APP_API_URL}/api/account/getAccountDetails`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials:'include'
				}
			)
			const accData = await accResponse.json();
			if(accResponse.ok){
				setUser(accData.data)
				// console.log(accData.data)
			}
		} catch (error) {
			
		} finally{
			setLoading(false)
		}
	}
	const checkSession = useCallback(()=>{
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
	},[dispatch,navigate]) 
	const updateTimeAndDate = useCallback(()=>{
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
	  },[dispatch,checkSession]) 

	useEffect(() => {
		// Update time and date every second
		const intervalId = setInterval(updateTimeAndDate, 1000);
		// Cleanup the interval when the component is unmounted
		return () => clearInterval(intervalId);
	},[updateTimeAndDate])

	useEffect(()=>{
		setLoading(true)
		getUser();
		// console.log(user)
	},[])
	const date = useSelector((state) => state.ui.date);
	const time = useSelector((state) => state.ui.time);
	if (loading || !date || !time) {
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
