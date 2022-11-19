import React, { useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { findUser, createUser, createOrUpdateStatsRecord, passwordValid } from "../data/repository";
import officePic from "../data/imgs/office.jpg"

export default function Register() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    username: "", firstname: "", lastname: "",  password: "", confirmPassword: ""
  });
  const { loginUser } = useContext(UserContext);
  const [errors, setErrors] = useState({ });

  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form and if invalid do not contact API.
    const { trimmedFields, isValid } = await handleValidation();
    if(!isValid)
      return;

    // Create user.
    const user = await createUser(trimmedFields);

    if(user !== null && user.blocked === false){
      createOrUpdateStatsRecord({
        username: user.username,
        login: true
      });
    }

    // Set login user by useContext.
    loginUser(user)

    // Navigate to the home page.
    navigate("/");
  };

  const handleValidation = async () => {
    const trimmedFields = trimFields();
    const currentErrors = { };

    let key = "username";
    let field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "Username is required.";
    else if(field.length > 32)
      currentErrors[key] = "Username length cannot be greater than 32.";
    else if(await findUser(trimmedFields.username) !== null)
      currentErrors[key] = "Username is already registered.";

    key = "firstname";
    field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "First name is required.";
    else if(field.length > 40)
      currentErrors[key] = "First name length cannot be greater than 40.";

    key = "lastname";
    field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "Last name is required.";
    else if(field.length > 40)
      currentErrors[key] = "Last name length cannot be greater than 40.";

    key = "password";
    field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "Password is required.";
    else if(!passwordValid(field))
      currentErrors[key] = "Password must contain at least a upper-case letter, a lower-case letter, a number and a special charactor.";

    key = "confirmPassword";
    field = trimmedFields[key];
    if(field !== trimmedFields.password)
      currentErrors[key] = "Passwords do not match.";

    setErrors(currentErrors);

    return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
  };

  const trimFields = () => {
    const trimmedFields = { };
    Object.keys(fields).map(key => trimmedFields[key] = fields[key].trim());
    setFields(trimmedFields);

    return trimmedFields;
  };

  return (
    <div className="row">
      <img className="col col-md-6 p-0 m-0 d-none d-lg-block" src={officePic}/>
      <div  className="col col-md-4 m-5">
        <h1>Register</h1>
        <hr />
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="control-label">Username</label>
                <input name="username" id="username" className="form-control"
                  value={fields.username} onChange={handleInputChange} />
                {errors.username &&
                  <div className="text-danger">{errors.username}</div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="firstname" className="control-label">First name</label>
                <input name="firstname" id="firstname" className="form-control"
                  value={fields.firstname} onChange={handleInputChange} />
                {errors.firstname &&
                  <div className="text-danger">{errors.firstname}</div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="lastname" className="control-label">Last name</label>
                <input name="lastname" id="lastname" className="form-control"
                  value={fields.lastname} onChange={handleInputChange} />
                {errors.lastname &&
                  <div className="text-danger">{errors.lastname}</div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="password" className="control-label">
                  Password <small className="text-muted">require "strong password"</small>
                </label>
                <input type="password" name="password" id="password" className="form-control"
                  value={fields.password} onChange={handleInputChange} />
                {errors.password &&
                  <div className="text-danger">{errors.password}</div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="control-label">Confirm password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" className="form-control"
                  value={fields.confirmPassword} onChange={handleInputChange} />
                {errors.confirmPassword &&
                  <div className="text-danger">{errors.confirmPassword}</div>
                }
              </div>
              <div className="form-group my-4">
                <input type="submit" className="btn btn-primary mr-5" value="Register" />
                <Link className="btn btn-outline-dark" to="/">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
