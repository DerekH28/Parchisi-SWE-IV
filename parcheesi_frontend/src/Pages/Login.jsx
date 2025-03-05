// Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import SubmitButton from '../submit';
import { supabase } from '../supabaseFetch'; 

function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Handle email/password login using Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    });
    if (error) {
      console.error('Error signing in:', error.message);
      setErrorMsg(error.message);
    } else {
      setErrorMsg('');
      // On successful login, navigate to the Menu page
      navigate('/Menu');
    }
  };

  // Handle login with Google using Supabase OAuth
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error signing in with Google:', error.message);
      setErrorMsg(error.message);
    } else {
      setErrorMsg('');
      navigate('/Menu');
    }
  };

  const handleSignUp = () => {
    navigate('/SignUp');
  };

  return (
    <div className="login-container">
      <h1 className="app-title">Parcheesi</h1>
      <h2 className="slogan">Chase, Race, Capture</h2>
      
      <div className="login-box">
        <div className="sign-in-box">
          <h3>Sign In</h3>
          {errorMsg && <p className="error-message">{errorMsg}</p>}
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
                required
              />
            </div>
            {/* Use the reusable SubmitButton for login */}
            <SubmitButton 
              type="submit"
              label="Sign In"
              onClick={handleLogin} 
              className="sign-in-btn"
            />
          </form>
          {/* Button for Google login */}
          <SubmitButton 
            onClick={handleGoogleLogin}
            label="Sign In with Google"
            className="google-sign-in-btn"
          />
          <p className="forgot-password">
            {/* Optionally use SubmitButton for consistency */}
            <SubmitButton 
              onClick={() => navigate("/forgot-password")}
              label="Forgot password?"
              className="forgot-password-btn"
            />
          </p>
        </div>

        <div className="sign-up-box">
          <h3>Welcome to Login</h3>
          <p>Don&apos;t have an account?</p>
          <SubmitButton 
            onClick={handleSignUp} 
            label="Sign Up"
            className="sign-up-btn"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

