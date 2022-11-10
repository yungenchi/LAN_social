import React, {useContext} from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import {logoutAction} from "../reducer/user"


export default function Navbar() {
  const {user, userDispatch} = useContext(UserContext)

  const handleLogOut = () => {
    userDispatch(logoutAction())
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Admin Port</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {user !== null &&
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard"> Dashboard </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/manage/user"> User Manage </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/manage/post"> Post Manage </Link>
                </li>
              </>
            }
          </ul>
          <ul className="navbar-nav">
            {user === null ?
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
              :
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">Welcome, {user.username}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={handleLogOut}>Logout</Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}
