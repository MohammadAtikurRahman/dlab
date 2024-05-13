import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signin.css'
import backgroundImage from './cover.png'; // Make sure the path is correct

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "admin" && password === "0000") {
      navigate("/home");
    } else {
      alert("Incorrect Username or Password");
    }
  };

  return (
    <div className="login-container"
    style={
      {
  
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
 
      }
    }>
      <div className="login-card">
        <h3 className="login-title">DLAB ADMIN PANEL</h3>
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="login-input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
            />
          </div>
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );

}

export default SignIn;
