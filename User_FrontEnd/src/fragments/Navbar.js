import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(props) {

  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container-fluid">
        <Link className="navbar-brand text-wrap" to="/">LAN</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {props.user !== null &&
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={()=>navigate("/profile")}>My Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/forum" onClick={()=>navigate("/forum")}>Forum</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/follow">Follows</Link>
                </li>
              </>
            }
          </ul>
          <ul className="navbar-nav">
            {props.user === null ?
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={()=>navigate("/register")}>Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={()=>navigate("/login")}>Login</Link>
                </li>
              </>
              :
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">Hello {props.user.username}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={props.logoutUser}>Logout</Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}
