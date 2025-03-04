import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import SubmitButton from './submit'

function Login() {
    const [userEmail, setUserEmail] = useState(''); 
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = (e) => {
        e.preventDefault();

        // validate email and password here

        navigate('/Menu')
    }

    const handleSignUp = () => {
        navigate('/SignUp')
    }

    return (
        <div className="login-container" >
            <h1 className="app-title">Parcheesi</h1>
            <h2 className="slogan">Chase, Race, Capture</h2>
            
            <div className="login-box" >
                <div className="sign-in-box" >
                    <h3>Sign In</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                            type="email"
                            id="email"
                            placeholder="e.g. skibidisigmas123"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                            type="password"
                            id="password"
                            placeholder="sup3rh@rdPa$$word"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required/>
                        </div>
                        <button type="submit" className="sign-in-btn" >Sign In</button>
                    </form>
                    <p className="forgot-password">
                        <button onClick={() => navigate("/forgot-password")}>Forgot password?</button> {/* fix later */}
                    </p>
                </div>

                <div className="sign-up-box">
                    <h3>Welcome to Login</h3>
                    <p>Don&apos;t have an account?</p>
                    <button onClick={handleSignUp} className="sign-up-btn">Sign Up</button>
                </div>
            </div>
        </div>
    )

}

export default Login