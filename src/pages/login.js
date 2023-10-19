import React, { useState } from "react";
import "./css/login.css";
import "bootstrap/dist/css/bootstrap.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongPass, setWrongPass]= useState(false);
  const [userExist, setUserExist] =useState(true);
    async function login(ev){
     ev.preventDefault();
     const response= await fetch("http://127.0.0.1:8000/login",{
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers:{
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
      },
      credentials: "include"
     });
     if(response.ok){
      setWrongPass(false);
      setUserExist(true);
        window.location.reload();
        window.location.href="/home";
     }
    //  console.log(response.status);
     if(response.status === 401){
        setWrongPass(true);
     }
     if(response.status===400){
        setUserExist(false);
     }
  }

  return (
    <main className="form-signin w-100 m-auto">
      <form action="/" method="post" onSubmit={login}>
        {/* <div className="d-flex align-items-center justify-content-center justify-content-lg-start h3 mb-3">
          <button type="button" className="btn google-button">
            <span className="d-flex align-items-center justify-content-center">
              <img
                src={require("./images/google-icon.png")}
                className="me-3"
                alt="Google Icon"
              />
              <h5 className="fw-normal mb-0">Sign in with Google</h5>
            </span>
          </button>
        </div>

        <div className="divider d-flex justify-content-center align-items-center my-4">
          <p className="text-center fw-bold mx-3 mb-0">Or</p>
        </div> */}
        <h2>Login!</h2>
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
          Login
        </button>

        {/* <div class="form-check mb-0 mt-4 d-flex">
          <div>
            <input
              class="form-check-input me-2"
              type="checkbox"
              value=""
              id="form2Example3"
            />
            <label class="form-check-label" for="form2Example3">
              Remember me
            </label>
          </div>
          <a href="#!" class="text-body">
            Forgot password?
          </a>
        </div> */}
        <div className={`error wrong-pass ${!wrongPass && "d-none" }`}>Wrong password</div>
        <div className={` error user-exist ${userExist && "d-none" }`}>Username doesn't exist</div>
        <div class="text-center text-lg-start mt-4 pt-2 d-flex justify-content-center">
          <p class="small fw-bold pt-1 mb-0">
            Don't have an account?{" "}
            <a href="/sign-up" class="link-danger ms-2">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}

export default Login;
