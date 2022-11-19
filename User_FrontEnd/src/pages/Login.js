import React, { useState , useContext} from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { verifyUser, createOrUpdateStatsRecord } from "../data/repository";
import officePic from "../data/imgs/office.jpg"


export default function Login() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const { loginUser } = useContext(UserContext);

  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = await verifyUser(fields.username, fields.password);

    if(user === null) {
      // Login failed, reset password field to blank and set error message.
      setFields({ ...fields, password: "" });
      setErrorMessage("Username and / or password invalid, please try again.");
      return;
    }

    if(user.blocked === true) {
      setFields({ ...fields, password: "" });
      setErrorMessage("Your account has been blocked. Please contact the Adminstrator for further information.");
      return;
    }

    if(user !== null && user.blocked === false){
      createOrUpdateStatsRecord({
        username: user.username,
        login: true
      });
    }

    // Set login user by useContext.
    loginUser(user);

    // Navigate to the home page.
    navigate("/");
  };

  return (
    <div className="row">
      <img className="img-fluid  col col-lg-6 p-0 m-0 d-none d-lg-block" src={officePic}/>
      <div className="col col-md-4 m-5">
        <h1>Login</h1>
        <hr />
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="control-label">Username</label>
                <input name="username" id="username" className="form-control"
                  value={fields.username} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="control-label">Password</label>
                <input type="password" name="password" id="password" className="form-control"
                  value={fields.password} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <input type="submit" className="btn btn-primary" value="Login" />
              </div>
              {errorMessage !== null &&
                <div className="form-group">
                  <span className="text-danger" role={"alert"}>{errorMessage}</span>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
