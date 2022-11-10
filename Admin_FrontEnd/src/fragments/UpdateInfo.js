import React, { useState, useContext, useEffect } from "react";
import UserSelectContext from "../contexts/UserSelectContext";
import {blockUser, getUser, unblockUser} from "../data/repository";

export default function UpdateInfo() {
  const { userSelect , setUserSelect} = useContext(UserSelectContext);
  const [isShow, setIsShow] = useState(true);
  const [fields, setFields] = useState({username:userSelect.username, firstname: userSelect.firstname, lastname: userSelect.lastname,  password: "", confirmPassword: "", blocked: userSelect.blocked});
  const [errors, setErrors] = useState({ });

  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleBlockUser = async (event) =>{
    event.preventDefault()

    if (fields.blocked) {
      await unblockUser(fields.username);
    } else {
      await blockUser(fields.username);
    }
    // Get new user data from database
    const newUserData = await getUser(fields.username);
    // reset the userselect in context hook
    setUserSelect(newUserData);
    reloadData()
  }

  const reloadData = async () => {
    // update this fragment user data
    setFields({username:userSelect.username, firstname: userSelect.firstname, lastname: userSelect.lastname,  password: "", confirmPassword: "",  blocked: userSelect.blocked})
    setErrors({});
  }
  

  useEffect(()=>{
    reloadData();
  },[userSelect])

  const handleSubmit = async (event) => {
    event.preventDefault();

    // // Validate form and if invalid do not contact API.
    // const { trimmedFields, isValid } = await handleValidation();
    // if(!isValid)
    //   return;

    // // Update user.
    // await updateUser(trimmedFields);
    // await changePasswordUser(trimmedFields);
    
    // // Close this page
    // setIsEditing(false)
  };

  const handleValidation = async () => {
    const trimmedFields = trimFields();
    const currentErrors = { };

    let key = "firstname";
    let field = trimmedFields[key];
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
    else if(field.length < 6)
      currentErrors[key] = "Password must contain at least 6 characters.";

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
    <div>
      {/* <h1 className="headerS">Update Info</h1> */}
      <button className="btn mr-5 btn-secondary" onClick={()=>{setIsShow(!isShow)}}> {isShow? "Hide profile":"Show profile"}</button>
      {/* {isShow &&
      <>
      <h1 className="headerS">User Info</h1>
      <hr />
      </>} */}
      {isShow &&
      <>
      <h1 className="headerS">User Info</h1>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="username" className="control-label">Username</label>
              <input name="username" id="username" className="form-control"
                value={fields.username} onChange={handleInputChange} readOnly/>
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
                Password <small className="text-muted">must be at least 6 characters</small>
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
            <div className="form-group">
              <div className="headerS">
                <input type="submit" className="btn btn-primary mr-5" value="Update" disabled/>
                <button className="btn btn-danger mr-5" onClick={handleBlockUser}>{fields.blocked? "unblock": "block"}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
    }
    </div>
  );
}
