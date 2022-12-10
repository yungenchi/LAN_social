import React, { useContext, useState, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { findUser, checkFollow, follow, unFollow, getAllUsers } from "../data/repository";
import {  getRootPosts, getRootPostsOfUser, createPost , deletePost, editPost} from "../data/repository";
import Comment from "../fragments/Comment";


export default function Follows(){
    const { user } = useContext(UserContext);
    const username = user.username

    const [userList, setUserList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showUsers, setShowUsers] = useState([])

// ---------- console.log ----------

    useEffect(() => {
        console.log("userList", userList)
    }, [userList])
    useEffect(() => {
        console.log("followingList", followingList)
    }, [followingList])
    useEffect(()=>{
        console.log("showUsers", showUsers);
    }, [searchText])


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


// ---------- handle input ----------

    const handleSearchChange = (event) => {
        setSearchText(event.target.value)
        console.log(searchText);
    }


    return(
        <>
            <div className="m-3 mx-auto container justify-content-md-center">
                <input className="row form-control align-items-center mr-3" 
                type='text' id='userSearch' placeholder="Enter username for search" 
                value={searchText} onChange={handleSearchChange}
                />
                <div className="row">
                    <ul className="list-group">
                        {showUsers.length > 0 ? 
                            (showUsers.map((user) => (
                                <li className="list-group-item">
                                    <button className =
                                        {followingList.includes(user.username)? 
                                        "list-group-item-action my-1 btn btn-outline-danger" : "list-group-item-action my-1 btn btn-outline-primary"}> 
                                        {user.username} 
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