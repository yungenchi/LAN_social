import React, { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { ActiveCharts } from "../fragments/ActiveCharts";


  function DashBoard() {
    // Home is opting-in to view username state.
    const { user } = useContext(UserContext);
  
    return (
      <>
      { user && 
        <div>
          <ActiveCharts />
        </div>
      }
      </>
    );
  }
  
  export default DashBoard;
