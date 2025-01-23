import bgImage from '../assets/login-bg.jpg';
import RegisterCard from '../components/RegisterCard';

const Register = () => {
	document.title="Nelvonce- Register"
    return (
        <div
			className="login-page login-bg"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				position: 'relative',
				zIndex: '0',
			}}>
			<div className="login-logo">
				<h3 className="mb-4 text-center" style={{fontWeight:'50',color:'white'}}>Nelvonce</h3>
			</div>
			<div className="login-box">
                <RegisterCard></RegisterCard>
                
			</div>
		</div>
    )
}
export default Register