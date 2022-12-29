import React, { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../contexts/UserContext";
import { checkFollowings, checkFollowers, follow, unFollow, getAllUsers } from "../data/repository";
import { getRootPosts, getRootPostsOfUser, createPost, deletePost, editPost } from "../data/repository";
import {Badge,Button, Modal} from 'react-bootstrap';


import "../MyProfile.css";

export default function Follows() {
    const { user } = useContext(UserContext);
    const [searching, setSearching] = useState(false)


    const [userList, setUserList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showUsers, setShowUsers] = useState([])

    const [showModal, setShowModal] = useState([])

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
        const followings = await checkFollowings(user);
        var users = []
        followings.map((user) => {
            users.push(user)
        })
        setFollowingList(users)
        console.log("followings", followingList);
    }
    
    const loadFollowers = async () => {
        const followers = await checkFollowers(user);
        var users = []
        followers.map((user) => {
            users.push(user)
        })
        setFollowerList(users)
        console.log("followers", followerList);
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

    useEffect(() => {
        loadAllUsers();
        loadFollowings();
        loadFollowers();
    }, [])

    useEffect(() => {
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
        const followed = followingList.map((f)=>{return f.username}).includes(username)
        if (!followed) {
            await follow({ "username": username, "followedBy": user.username })
            console.log("follow");
            loadFollowings();
        } else {
            await unFollow({ "username": username, "followedBy": user.username })
            console.log("unfollow");
            loadFollowings();
        }
    }


    return (
        <>
            <br />
            <div className="mt-3 row d-flex justify-content-center">
                <div className="col col-md-5" onFocus={() => { setSearching(true) }} onBlur={() => { setSearching(true) }} >
                    <input className="mx-0 row form-control"
                        type='text' id='userSearch' placeholder="Enter username for search"
                        value={searchText} onChange={handleSearchChange}
                    />
                    { (showUsers.length>0) && (UserList(showUsers, followingList, handleFollow))}
                </div>
                <div className="row">
                    {/* <div className="col me-1"> */}
                        <Button variant="primary" className="mx-2">
                            Following <Badge bg="secondary">{followingList.length}</Badge>
                        </Button>                    
                    {/* </div> */}
                    {/* <div className="col"> */}
                    <Button variant="primary">
                            Followers <Badge bg="secondary">{followerList.length}</Badge>
                        </Button>    
                    {/* </div> */}
                </div>
            </div>
        </>
    )
}


export function UserListModal(users, show, handleClose) {
    return (
        <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            UserList(users)
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}

export function UserList(users, followingList, handleFollow) {
    return (
        <ul className="searchBar col list-group px-1">
            {(users.map((user) => (
                <li key={user.username} className=" py-2 px-3 list-group-item d-flex justify-content-between">
                    <div className="ms-2 me-auto">
                        <a href="#" className="text-break text-decoration-none">{user.username}</a>
                        <div className="text-gray text-break" style={{ "fontWeight": "lighter", "fontStyle": "italic" }}>{user.firstname} {user.lastname}</div>
                    </div>
                    <button id={user.username} className={
                        followingList.map((f)=>{return f.username}).includes(user.username)? 
                        "btn btn-danger" : "btn btn-primary"}
                        onClick={handleFollow} >
                        {followingList.map((f)=>{return f.username}).includes(user.username)? "Unfollow": "Follow"}
                    </button>
                </li>
            )))}
        </ul>
    )
}