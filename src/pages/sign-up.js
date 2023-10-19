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
    const response= await fetch("/api/sign-up", {
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
