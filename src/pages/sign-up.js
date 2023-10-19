import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/sign-up.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect]= useState(false);
  const [userTaken, setUserTaken]= useState(false);
  async function register(ev) {
    ev.preventDefault();
    const response= await fetch("http://127.0.0.1:8000/sign-up", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
      if(response.ok){
        setRedirect(true);
        setUserTaken(false);
      }
      if(response.status===400){
        setUserTaken(true);
      }
  }
  if(redirect){
    return <Navigate to={'/login'} />
  }
  return (
    <main className="form-signin w-100 m-auto">
      <form onSubmit={register}>
        {/* <div className="d-flex align-items-center justify-content-center justify-content-lg-start h3 mb-3">
          <button type="button" className="btn google-button">
            <span className="d-flex align-items-center justify-content-center">
              <img
                src={require("./images/google-icon.png")}
                className="me-3"
                alt="Google Icon"
              />
              <h5 className="fw-normal mb-0">Sign up with Google</h5>
            </span>
          </button>
        </div>

        <div className="divider d-flex justify-content-center align-items-center my-4">
          <p className="text-center fw-bold mx-3 mb-0">Or</p>
        </div> */}
        <h2>Sign up!</h2>
        <div className="form-floating">
          <input
            name="username"
            type="text"
            className="form-control top"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating">
          <input
            name="password"
            type="password"
            className="form-control bottom mb-4"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
        </div>

        <button className="btn btn-dark w-100 py-2" type="submit">
          Submit
        </button>
        <div className={`error user-taken ${!userTaken && "d-none"}`}>Username already taken</div>
      </form>
    </main>
  );
}

export default SignUp;
