import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./css/navigation.css";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../user-context";

const navLinks = [
  {
    title: "Home",
    path: "/home",
  },
  {
    title: "My posts",
    path: "",
  },
  {
    title: "Search",
    path: "/search",
  },
  {
    title: "Create new post",
    path: ""
  }
];

function Navigation() {
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);
  const {userInfo, setUserInfo}=useContext(UserContext);
  useEffect(() => {
   
    fetch("/api/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then(async (userInfo) => {
       setUserInfo(userInfo);
     
      });
    });
  }, []);

  function logout() {
    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    }).then(()=>{
      setUserInfo(null);
      navigate("/login");
    });
    
    navLinks[3].path = "/login";
  }

  const username= userInfo?.username;

  navLinks[1].path=`/posts/${userInfo?.id}`;
  navLinks[3].path = userInfo?.username ? "/create-post" : "/login";
  return (
    <div className="navigation-bar">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light d-flex py-3">
          <a className="navbar-brand" href="/">
            MiniBlog
          </a>

          <div className={`navbar-collapse d-flex ${menuActive && "active"}`}>
            <div className="nav navbar-nav">
              {navLinks.map((link, index) => {
                return (
                  <a key={index} className={`nav-item nav-link ${(!userInfo?.username && index===1) && `d-none`}`} href={link.path}>
                    {link.title}
                  </a>
                );
              })}
              <div className="d-lg-none">
                {!username && (
                  <>
                    <a className={`nav-item nav-link`} href="/login">
                      Login
                    </a>
                    <a className={`nav-item nav-link`} href="/sign-up">
                      Sign Up
                    </a>
                  </>
                )}
                {username && (
                
                  <button
                    className={`nav-item nav-link`}
                    onClick={logout}
                  >
                    Log Out
                  </button>
                 
                )}
              </div>
            </div>
          
          {!username && (
              <div
              className={`buttons navbar-nav d-none align-items-center
               d-lg-block d-lg-flex
              `}
            >
              <a className=" button nav-item nav-link me-2" href="/login">
                <button type="button" className="btn btn-outline-dark">
                  Login
                </button>
              </a>
              <a className="button nav-item nav-link " href="/sign-up">
                {" "}
                <button type="button" className="btn btn-dark">
                  Sign Up
                </button>{" "}
              </a>
            </div>
          )}
          
          {username && (
             <div class="dropdown">
             <button
               class="dropdown-toggle"
               type="button"
               id="dropdownMenuButton"
               data-toggle="dropdown"
               aria-haspopup="true"
               aria-expanded="false"
             >
               <span
                 className={`avatar-span d-flex align-items-center nav-item`}
               >
                 <Avatar
                   className=" me-2"
                   style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                 >
                  {`${username}`.slice(0,1).toLocaleUpperCase()}
                 </Avatar>
                 <span className="avatar-name">{`${username}`}</span>
               </span>
             </button>
             <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
               <a class="dropdown-item" onClick={logout}>
                 Logout
               </a>
             </div>
           </div>
          )}
           
          </div>
          <span
            className="navbar-toggler-icon d-lg-none"
            onClick={() => setMenuActive(!menuActive)}
          />
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
