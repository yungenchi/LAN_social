import React, { useState} from "react";
import UserContext from "./contexts/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./fragments/Navbar";
import Footer from "./fragments/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import Forum from "./pages/Forum";
import {findUser} from "./data/repository";
import Follows from "./pages/Follows";

export default function App() {
  // Default no user logged in
  const [user, setUser] = useState(null);

  const loginUser = (user) => {
    setUser(user);
  }
  const logoutUser = () => {
    setUser(null);
  }
  const updateUserData = async (username) => {
    const user = await findUser(username)
    setUser(user)
  }

  return (
    <div className="d-flex flex-column min-vh-100" style={{backgroundColor: "#c9c9c9"}}>
      <UserContext.Provider value={{ user, loginUser, logoutUser, updateUserData}}>
        <Router>
          <Navbar user={user} logoutUser={logoutUser} />
          <main role="main">
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/profile" element={<MyProfile/>} />
                <Route path="/forum" element={<Forum/>} />
                <Route path="/follow" element={<Follows />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </Router>
      </UserContext.Provider>
    </div>
  );
}
