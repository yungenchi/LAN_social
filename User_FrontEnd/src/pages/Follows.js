import React, { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../contexts/UserContext";
import { findUser, checkFollow, follow, unFollow, getAllUsers } from "../data/repository";
import {  getRootPosts, getRootPostsOfUser, createPost , deletePost, editPost} from "../data/repository";
import Comment from "../fragments/Comment";

import "../MyProfile.css";

export default function Follows(){
    const { user } = useContext(UserContext);
    const [searching , setSearching] = useState(false)


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
    }, [searchText])

// ---------- handle ----------

    const handleSearchChange = (event) => {
        setSearchText(event.target.value)
    }
    const handleFollow = async (event) => {
        event.preventDefault();
        console.log(event);
        const username = event.target.id
        const followed = followingList.includes(username)
        if (!followed) {
            await follow({"username": username, "followedBy":user.username})
            console.log("follow");
            loadFollowings();
        }else{
            await unFollow({"username": username, "followedBy":user.username})
            console.log("unfollow");
            loadFollowings();
        }
    }


    return(
        <>
            <div className="mt-3 row d-flex justify-content-center">
                <div className="col col-md-6"  onFocus={()=>{setSearching(true)}} onBlur={()=>{setSearching(true)}} >
                    <input className="mx-0 row form-control"
                    type='text' id='userSearch' placeholder="Enter username for search" 
                    value={searchText} onChange={handleSearchChange}
                    />
                    <ul className="searchBar col list-group px-1" hidden={!searching}>
                        {showUsers.length > 0 ? 
                            (showUsers.map((user) => (
                                <li key={user.username} className="py-2 px-3 list-group-item d-flex justify-content-between">
                                    <div class="ms-2 me-auto">
                                        <div class="text-dark fw-bold">{user.username}</div>
                                        <div class="text-secondary fw-bold">{user.firstname} {user.lastname}</div>
                                    </div>
                                    <button id={user.username} className={followingList.includes(user.username)? "btn btn-danger" : "btn btn-primary"}
                                    onClick={handleFollow} > 
                                        {followingList.includes(user.username)? "Unfollow": "Follow"} 
                                    </button>
                                </li>
                            ))) : <></>}
                    </ul>
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