import React, { useContext } from "react";
// import logo from "../logo.svg";
import UserContext from "../contexts/UserContext";
// import { FaHandshake } from "react-icons/fa";
import globeDefaultPic from "../data/imgs/globe.png"


  function Home() {
    // Home is opting-in to view username state.
    const { user } = useContext(UserContext);
  
    return (
      <div className="text-center">
        <h1 className="display-4"><b><i>Loop Agile Now (LAN)</i></b></h1>
        {user !== null && <h4><strong>Hello {user.first_name}! Welcome to LAN</strong></h4>}
        {/* < FaHandshake className="App-logo"/> */}
        <p>
        COVID-19 pandemic has made a massive impact on our lives. Many of us are still reeling through emotional aftermath 
        of the earlier lockdowns, ongoing challenges posed by the pandemic and fear of getting sick. While the public health 
        actions, such as social distancing, are necessary to reduce the spread of COVID-19, they can make us feel isolated and 
        lonely and can increase stress and anxiety. Most people still feel comfortable operating on online basis only. According 
        to a report published by Deloitte titled ‘Media Consumer Survey’- both 2020 and 2021 were the years of digital 
        acceleration for many industries and businesses- social media platforms being at the forefront. 
        <br></br>
        <br></br>
        IT consultancy firm called as Loop Agile (LA) is a fast-growing firm with offices in major metropolitan cities in Australia. 
        LA specialises in the design, delivering and managing innovative data & analytics, customer engagement and cloud 
        solutions that help to sustain competitive advantage. Their employee base is growing rapidly and owing to restrictions 
        posed by COVID, many of the staff members work fully online. Employees often liaise with other colleagues, middle to 
        senior level staff to discuss questions, queries, issues and suggestions about the projects undertaken, innovation in the 
        related IT fields and general topics. Often, this is done via text messages, apps, social media forums and personal 
        conversations. While these may not be seen as an important part of an employee’s routine by many; sometimes these 
        networks serve a very crucial role thereby enabling a community of practice.  There are other issues associated with 
        having these discussions on external websites/forums as it may lead to all sorts of issues around ethics and in some 
        serious cases- contravention of firm’s policies and professional ramifications. 
       <br></br>
       <br></br>
        Therefore, due to these reasons, we have been approached by a senior representative of  LA who has secured funding to 
        build this intra-firm social media website known as Loop Agile Now (LAN).  At the moment, LAN seeks to assist the employees in making a post, replying to other posts and maintain their profile details. 
        </p>
        <br></br>
        <br></br>
   
        {/* <img class="globe-photo" src={globeDefaultPic} alt="photo" /> */}
      </div>
    );
  }
  
  export default Home;
