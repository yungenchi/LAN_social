import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import UserSelectContext from "../contexts/UserSelectContext";
import UpdateInfo from "../fragments/UpdateInfo"
import {getAllUsers, getUser} from "../data/repository"
import FollowMetric from "../fragments/FollowMetric";

export default function UserManage() {

  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState([]);
  const [userSelect, setUserSelect] = useState(null);
  
  const reloadUserData = async () => {
    const data = await getAllUsers();
    setUserData(data)
  }
  
  const handleSelectUser = async (event) => {
    event.preventDefault();
    if (event.target.value === null){
      setUserSelect(null)
    }else{
      const user = await getUser(event.target.value)
      setUserSelect(user)
    }
  }

  useEffect(()=>{
    reloadUserData()
  }, [])

    return (
      <>
        {user &&
          <div>
            <div className="row">
              <select  onChange={handleSelectUser} className="form-select form-select-lg mb-3" aria-label=".form-select-lg select-user">
                <option defaultValue value={null}>Select a user</option>
                {
                  userData.map((user)=> (
                    <option key={user.username} value={user.username}>{user.username}</option>
                  ))
                }
              </select>
            </div>
            <div>
              { userSelect &&
                <UserSelectContext.Provider value={{ userSelect , setUserSelect}}>
                  <UpdateInfo/>
                  <FollowMetric/>
                </UserSelectContext.Provider>
              }
            </div>

          </div>
        }
      </>
    );
  }
