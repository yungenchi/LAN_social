import React, { useReducer} from "react";
import UserContext from "./contexts/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./fragments/Navbar";
import Footer from "./fragments/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home"
import UserManage from "./pages/UserManage";
import PostManage from "./pages/PostManage";
import {initialUser, userReducer, loginAction, logoutAction, updateAction} from "./reducer/user"

export default function App() {
  // Default no user logged in
  const [user, userDispatch] = useReducer(userReducer, initialUser);

  return (
    <div className="d-flex flex-column min-vh-100">
      <UserContext.Provider value={{ user, userDispatch}}>
        <Router>
          <Navbar />
          <main role="main">
            <div className="container my-3">
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/manage/user" element={<UserManage/>}/>
                <Route path="/manage/post" element={<PostManage/>}/>
              </Routes>
            </div>
          </main>
          <Footer />
        </Router>
      </UserContext.Provider>
    </div>
  );
}
