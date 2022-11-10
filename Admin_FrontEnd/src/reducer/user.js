import { getAdmin } from "../data/repository";

export const initialUser = null
  
  const LOGIN = "LOGIN";
  const LOGOUT = "LOGOUT";
  const UPDATE = "UPDATA";
  
  export  function userReducer(state, action) {
    switch (action.type) {
      case LOGIN:
        return action.payload.user
      case LOGOUT:
        return null
      // case UPDATE:
      //   const username = action.payload.user.username
      //   return {user: getAdmin(username)}
      default:
        return state;
    }
  }
  
  export function loginAction(user) {
    return {
      type: LOGIN,
      payload: {
        user
        }
      }
    };

  
  export function logoutAction() {
    return {
      type: LOGOUT
    };
  }
  
  // export function updateAction(user) {
  //   return {
  //     type: UPDATE,
  //     payload: {
  //       user
  //     }
  //   };
  // }
  