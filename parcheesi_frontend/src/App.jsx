import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './Pages/Login';
import Menu from './Pages/Menu';
import SignUp from './Pages/SignUp';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  return (
  <Router>
    <nav>
      <ul>

      </ul>
    </nav>

    <Routes>
      <Route path="/" element={
        <Login
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        userPassword={userPassword}
        setUserPassword={setUserPassword}
        />
      }/>
      <Route path="/menu" element={<Menu />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
  
  );
}

export default App;
