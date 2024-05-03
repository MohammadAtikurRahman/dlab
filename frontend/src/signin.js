import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="container mt-5">
      <br></br>
      <br></br> <br></br> <br></br> <br></br> <br></br> 
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card border">
            <div className="card-body">
              <h2 className="card-title mb-3 text-center">DLAB ADMIN PANEL</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Username:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <button className="btn btn-success" type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
