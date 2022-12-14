import React, { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../contexts/UserContext";
import { findUser, checkFollow, follow, unFollow, getAllUsers } from "../data/repository";
import {  getRootPosts, getRootPostsOfUser, createPost , deletePost, editPost} from "../data/repository";
import Comment from "../fragments/Comment";

import "../MyProfile.css";

export default function Follows(){
    const { user } = useContext(UserContext);
    const username = user.username
    const [searching , setSearching] = useState(false)
    // const searchRef = useRef(null);

    const [userList, setUserList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showUsers, setShowUsers] = useState([])

// ---------- console.log ----------

    // useEffect(() => {
    //     console.log("userList", userList)
    // }, [userList])
    // useEffect(() => {
    //     console.log("followingList", followingList)
    // }, [followingList])
    // useEffect(()=>{
    //     console.log("showUsers", showUsers);
    // }, [searchText])


// ---------- Data ----------

    const loadFollowings = async () => {
        const followings = await checkFollow(user);
        var followingsUsernames = []
        followings.map((user) => {
            followingsUsernames.push(user.username)
        })
        setFollowingList(followingsUsernames)
    }

    const loadAllUsers = async () => {
        const allUsers = await getAllUsers();
        setUserList(allUsers)
    }

    const loadShowUsers = () => {
        if (searchText.trim() === "") {
            setShowUsers([]);
            return;
        }
        var showLists = []
        userList.map((user) => {
            if (user.username.includes(searchText)) {
                showLists.push(user)
            }
        })
        setShowUsers(showLists)
    }

    useEffect(()=>{
        loadAllUsers();
        loadFollowings();
    },[])

    useEffect(()=>{
        loadShowUsers();
        console.log(document.activeElement);
    }, [searchText])

    // useEffect(() => {
    //     if (document.activeElement === searchRef.current) {
    //       console.log('element has focus');
    //       setSearching(true)
    //     } else {
    //       console.log('element does NOT have focus');
    //       setSearching(false)
    //     }
    //   }, [document.activeElement]);


// ---------- handle input ----------

    const handleSearchChange = (event) => {
        setSearchText(event.target.value)
    }


    return(
        <>
            <div className="mt-3 container">
                <div className="row justify-content-center">
                    <input onFocus={() =>{setSearching(true)}} onBlur={() =>{setSearching(false)}}  className="col col-6 form-control" 
                    type='text' id='userSearch' placeholder="Enter username for search" 
                    value={searchText} onChange={handleSearchChange}
                    />
                </div>
                <div className="row justify-content-center">
                    <ul className="searchBar col col-6 list-group center px-1" hidden={!searching}>
                        {showUsers.length > 0 ? 
                            (showUsers.map((user) => (
                                <li key={user.username} className="list-group-item">
                                    <button className =
                                        {followingList.includes(user.username)? 
                                        "list-group-item-action my-1 btn btn-outline-danger" : "list-group-item-action my-1 btn btn-outline-primary"}> 
                                        {user.username} 
                                    </button>
                                </li>
                            ))) : <></>}
                    </ul>
                </div>
                <div className="row justify-content-center">
                    <input/>
                </div>
            </div>
        </>
    )
}


// function userListItem(username) {
//     const following = useState(false)

//     setUser()


//     useEffect(,[])

//     return(
//         <li>{username}
//             <button className="btn btn-primary ">
//                 {following ? "follow" : "unfollow"}
//             </button>
//         </li>
//     )
// }