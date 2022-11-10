import React, { useContext, useState, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { findUser, checkFollow, follow, unFollow, getAllUsers } from "../data/repository";
import {  getRootPosts, getRootPostsOfUser, createPost , deletePost, editPost} from "../data/repository";
import Comment from "../fragments/Comment";


export default function Follows(){
    const { user } = useContext(UserContext);
    const username = user.username

// --- Follow ---------------------------------------------------------------------------------------
    const [followingList, setFollowingList] = useState([]);
    const [searchUser, setSearchUser] = useState(null);
    const [toFollowUsers, setToFollowUsers] = useState([]);
    const [followShowing, setFollowShowing] = useState(false);
    const [toFollowShowing, setToFollowShowing] = useState(false);
    const [count, setCount] = useState(0);

    const handleSubmit = async () => {
        const searchuser = await findUser(document.getElementById('userSearch').value);
        if (searchuser) {setSearchUser(searchuser.username)} else{setSearchUser(" ")}
        setFollowings();
    }

    const setFollowings = async () => {
        const followings = await checkFollow(user);
        if(followings){
            var followingslist = []
            followings.map((eachFollowing) => {
                followingslist.push(eachFollowing.username)
            })
            setFollowingList(followingslist)
        }
    }

    const setToFollowUsersList = async () => {
        const userslist = await getAllUsers();
        var toFollow = []
        var usernames = []
        userslist.map((eachUsr) => {
            usernames.push(eachUsr.username)
        })
        const followings = await checkFollow(user);
        if(followings){
            var followingslist = []
            followings.map((eachFollowing) => {
                followingslist.push(eachFollowing.username)
            })
        }
        usernames.map((eachUsrname) => {
            if(!followingslist.includes(eachUsrname) && user.username !== eachUsrname){
                toFollow.push(eachUsrname)
            }
        })
        setToFollowUsers(toFollow)
    }

    const following = async (event) => {
        event.preventDefault()
        await follow({username: searchUser, followedBy: user.username})
        setSearchUser(null)
    }

    const unFollowing = async (event) => {
        event.preventDefault()
        await unFollow({username: searchUser, followedBy: user.username})
        setSearchUser(null)
    }

    const following2 = async (event) => {
        event.preventDefault()
        await follow({username: event.target.value, followedBy: user.username})
        setSearchUser("")
        setCount(count+1)
    }

    const unFollowing2 = async (event) => {
        event.preventDefault()
        await unFollow({username: event.target.value, followedBy: user.username})
        setSearchUser(null)
        setCount(count+1)
    }

// --- Posts ---------------------------------------------------------------------------------------
  
    const [activeComment, setActiveComment] = useState(null);
    const [rootComments, setRootComments] = useState([]);
  
    const reloadRootComments = async() => {
        const followings = await checkFollow(user);
        if(followings){
            var followingslist = []
            followings.map((eachFollowing) => {
                followingslist.push(eachFollowing.username)
            })
            if(followings.length === 0){setRootComments(null)}
        }
        

        const loadFollowUserComments = async () => {
            await followings.map(
                async (x) => {
                const rootCommentFromUser = await getRootPostsOfUser({"username":x.username})
                rootCommentFromUser.map((comment) => {
                    var existed = false
                    if(rootComments){
                        rootComments.map((singleComment) => {
                            if(singleComment.id === comment.id){
                                existed = true
                            }
                        })
                    }
                    if(!existed){
                        rootComments.push(comment);
                    }
                })
                setRootComments(rootComments)
            })
        }
        await loadFollowUserComments();
    } 
  
    const addComment = async (text, parentId=null) => {
      const post = {username: username, text:text, parent_post_id: parentId}
      await createPost(post);
      setActiveComment(null)
      reloadRootComments()
    };
  
    const updateComment = async (text, commentId) => {
      const post = {id: commentId, text:text}
      await editPost(post);
      reloadRootComments();
      setActiveComment(null);
    };
  
    const deleteComment = async (commentId) => {
      if (window.confirm("Are you sure you want to remove comment?")) {
        const post = {id: commentId}
        await deletePost(post)
        reloadRootComments();
        setActiveComment(null);
      }
    };

    const showFollows = (e) => {
        e.preventDefault();
        document.getElementById('followsShow').style.visibility = "visible";
        setFollowShowing(true);
    }

    const showToFollows = (e) => {
        e.preventDefault();
        document.getElementById('toFollowShow').style.visibility = "visible";
        setToFollowShowing(true);
    }

    const unShowFollows = (e) => {
        e.preventDefault();
        document.getElementById('followsShow').style.visibility = "hidden";
        setFollowShowing(false);
    }

    const hideToFollows = (e) => {
        e.preventDefault();
        document.getElementById('toFollowShow').style.visibility = "hidden";
        setToFollowShowing(false);
    }

// --- useEffect ---------------------------------------------------------------------------------------
    useEffect(() => { 
        setFollowings();
        setToFollowUsersList();
    }, [searchUser, count]);
  
    useEffect(() => {
        reloadRootComments();
    }, [])

    useEffect(() => {
        reloadRootComments();
    }, [searchUser])


    useEffect(()=>{
        reloadRootComments();
    }, [count])

    return(
        <>
        <div>
            <div className="followsNorth">
                <div className="followSearch">
                    <span>Enter a name to search for a user :</span><br />
                    <input type='text' id='userSearch' placeholder="search a user with username"/>
                    <input type='button' id='submit' value="search" onClick={handleSubmit} /><br/><br/>
                    {searchUser !== user.username ? (<div>{searchUser ? (<div>{searchUser !== " " ? (<div><span>{searchUser}</span>&nbsp;{followingList.includes(searchUser) ? 
                    <button id="unfol" onClick={unFollowing}>Unfollow</button> : <button id="fol" onClick={following}>Follow</button>}</div>) 
                            : (<span>User not found</span>)}</div>) : (<span></span>)}</div>) : (<span>Yourself</span>)}
                </div>
                <div id='followsShow' className="followsShow">
                    <span>The users you're following: </span>
                    <ul>
                    {followingList && followingList.map((singleUser) => (
                        <div>
                            <li>{singleUser} <button value={singleUser} onClick={unFollowing2}>Unfollow</button></li>
                        </div>
                    ))}
                    </ul> 
                </div>          
                <div id='toFollowShow' className="toFollowShow">
                    <span>Users Recommended to Follow: </span>
                    <ul>
                    {toFollowUsers.length > 0 && toFollowUsers.map((singleUser) => (
                        <div>
                            <li>{singleUser} <button value={singleUser} onClick={following2}>Follow</button></li>
                        </div>
                    ))}
                    </ul>
                </div>
            </div> 
            <div className="followsMiddle">
                <hr />
                {!followShowing ? 
                (<button onClick={showFollows}>Show Following Users</button>) : 
                (<button onClick={unShowFollows}>Hide Following Users</button>)}&nbsp;
                {!toFollowShowing ? 
                (<button  onClick={showToFollows}>Show Recommended To Follow Users</button>) : 
                (<button onClick={hideToFollows}>Hide To Follow Users</button>)}
                <hr />
            </div>
            <div className="followsSouth">
                <h3 className="headerS">All posts of your following users</h3>
                <div className="comments-container">
                {rootComments ? rootComments.length>0 ? ( rootComments.map((rootComment) => (
                    <Comment
                    key={rootComment.id}
                    comment={rootComment}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    addComment={addComment}
                    deleteComment={deleteComment}
                    updateComment={updateComment}
                    />
                ))) : <h4 className="headerS">Loading...</h4> : <h6 className="headerS">Empty</h6>}
                </div>
            </div>
        </div>
        </>
    )
}