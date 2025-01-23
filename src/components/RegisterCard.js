import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom"
import { login, setExpired } from "../store/reducers/auth";

const RegisterCard = () => {
    const [registerData,setRegisterData] = useState({
        firstname : null,
        lastname : null,
        email : null,
        password : null,
        gender : 'female',
        dob : null,
        phonenumber : null,
        country : 'Afghanistan',
    })
    const [country,setCountry] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fetchCountry = async () => {
        try {
            const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/x-account/country`
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
            const result = await response.json();
            setCountry(result.data);
        } catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
    }
    useEffect(()=> {
        setLoading(true);
        fetchCountry();
    },[])
    const register = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/auth/register`,
                {
                    method:'POST',
                    headers: {
						'Content-Type': 'application/json',
					},
                    body:JSON.stringify(registerData),
                }
			);
            const data = await response.json();
			if (response.ok) {
                const authResponse = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/auth/authenticate`,
                    {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({
                            email: registerData.email,
                            password: registerData.password
                        }),
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
                        window.toastr.success("Register account success")
                        localStorage.setItem("account",JSON.stringify(accData.data))
                        dispatch(login(accData.data))
                        // console.log("Logged in", store.getState());
                        // console.log(localStorage.getItem("account"));
                        navigate('/dashboard');
                    }
                } else {
                    window.toastr.error(authData.errors)
                }
			} else {
				window.toastr.error(data.errors);
			}
            
        } catch (error) {
            
        }
    }
    const handleOnChange = (e) => {
		const { name, value } = e.target;
		setRegisterData({
			...registerData,
			[name]: value,
		});
    }
    if(loading){
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
    return(
        <div className="card register-card">
            <div className="card-body register-card-body" style={{minHeight:'auto'}}>
                <p
                    className="register-box-msg"
                    style={{ fontWeight: '300', color: 'black' }}>
                    Register Account
                </p>
                <form onSubmit={register}>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="form-control"
                                    placeholder="Email"
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    required
                                    className="form-control"
                                    placeholder="Password"
                                    name="password"
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>First name</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control"
                                    placeholder="First name"
                                    name="firstname"
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label>Last name</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control"
                                    placeholder="Last name"
                                    name="lastname"
                                    onChange={handleOnChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                    className="form-select"
                                    name="gender"
                                    onChange={handleOnChange}>
                                    <option value={"female"}>Female</option>
                                    <option value={"male"}>Male</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date of birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    className="form-control"
                                    id="date"
                                    aria-describedby="date"
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <div className="form-group">
                                <label>Country</label>
                                <select
                                    className="form-select"
                                    name="country"
                                    onChange={handleOnChange}>
                                    {country.map((data, i) => {
                                        return <option value={data} key={i}>{data}</option>;
                                    })}
                                </select>
                            </div>  
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button
                                type="submit"
                                className="btn btn-primary btn-block">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
                <div className="social-auth-links text-center mb-3">
                    <p>Have an account?</p>
                    <NavLink
                        to={"/"}
                        end
                        className="btn btn-block btn-primary">
                        Login here
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
export default RegisterCard