import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, setExpired } from '../store/reducers/auth';
import { useNavigate } from 'react-router-dom';
import store from '../store/store';
const LoginCard = () => {
	useEffect(() => {
		const link = document.createElement('link');
		link.rel = 'stylesheet'
		link.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css'
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js'
		script.async = true;
		document.head.appendChild(script);
		document.head.appendChild(link);
		return () => {
			document.head.removeChild(script);
			document.head.removeChild(link);
		};
	}, []);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const submitLogin = async (event) => {
		event.preventDefault();
		const bodyResponse = {
			email: email,
			password: password,
		};
		try {
			const authResponse = await fetch(
				`${process.env.REACT_APP_API_URL}/api/auth/authenticate`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(bodyResponse),
					credentials:'include'
				}
			);
			const authData = await authResponse.json();
			if (authResponse.ok) {
				localStorage.setItem("expiredTime",authData.data.expiredTime)
				dispatch(setExpired(authData.data.expiredTime))
				const token = authData.data.token;
				const accResponse = await fetch(
					`${process.env.REACT_APP_API_URL}/api/account/getAccountDetails`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'authorization': `Bearer ${token}`,
						},
						credentials:'include'
					}
				)
				const accData = await accResponse.json();
				if(accResponse.ok){
					localStorage.setItem("account",JSON.stringify(accData.data))
					dispatch(login(accData.data))
					console.log("Logged in", store.getState());
					console.log(localStorage.getItem("account"));
					navigate('/dashboard');
				}
			} else {
				window.toastr.error(authData.errors)
			}	
		} catch (err) {
			console.error('Login error:', err);
		}
	};
	return (
		<div className="card">
			<div className="card-body login-card-body">
				<p
					className="login-box-msg"
					style={{ fontWeight: '300', color: 'black' }}>
					Login here
				</p>
				<form onSubmit={submitLogin}>
					<div className="input-group mb-3">
						<input
							type="email"
							className="form-control"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<div className="input-group-append">
							<div className="input-group-text">
								<span className="fas fa-envelope"></span>
							</div>
						</div>
					</div>
					<div className="input-group mb-3">
						<input
							type="password"
							className="form-control"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className="input-group-append">
							<div className="input-group-text">
								<span className="fas fa-lock"></span>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<button
								type="submit"
								className="btn btn-primary btn-block">
								Sign In
							</button>
						</div>
					</div>
				</form>

				<div className="social-auth-links text-center mb-3">
					<p>- OR -</p>
					<a
						href="#"
						className="btn btn-block btn-primary">
						Register Here
					</a>
				</div>
				<p className="mb-1">
					<a href="forgot-password.html">I forgot my password</a>
				</p>
			</div>
		</div>
	);
};

export default LoginCard;
