import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import {deleteUser} from "../data/repository";
import UpdateInfo from "../fragments/UpdateInfo";
import '../MyProfile.css'
import {Button, Modal}from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {getRootPostsOfUser, createPost , deletePost, editPost, createOrUpdateStatsRecord, readOneRecord} from "../data/repository";
import Comment from "../fragments/Comment";
import userDefaultPhoto from "../data/imgs/user.png"

function MyProfile() {
  const { user, logoutUser, updateUserData} = useContext(UserContext);

  const nav = useNavigate();

  const updateFromData = async () => {
    await updateUserData(user.username)
  }
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleCloseAlert = () => setShowAlert(false);
  const handleShowAlert = () => setShowAlert(true);
  
  const handleDeleteConfrim = async () => {
      // Delete user from database
      await deleteUser(user);

      // Close alert pop-up
      handleCloseAlert();

      // Use useContext to log out
      logoutUser();
      nav('/');
  }

  useEffect(()=>{updateFromData()}, [isEditing])

  const [activeComment, setActiveComment] = useState(null);
  const [rootComments, setRootComments] = useState(null);

  const reloadRootComments = async() => {
    const rootCommentFromUser = await getRootPostsOfUser({"username": user.username})
    setRootComments({...rootComments, rootCommentFromUser})
  } 

  const addComment = async (text, image=null, parentId) => {
    // Have img to post
    if (image){
      const post = {username: user.username, text:text, parent_post_id: parentId, image: image}
      await createPost(post);
    }else{
      // Don't have img to post
      const post = {username: user.username, text:text, parent_post_id: parentId}
      await createPost(post);
    }
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

  useEffect(() => {
    reloadRootComments();
    let today = new Date();
    let month = today.getMonth() + 1;
    var date = today.getFullYear() + "-" + month + "-" + today.getDate();
    async function statsRecordUpdate(){ //getOriginalData and set
      const record = await readOneRecord({username: user.username, date: date});
      if(record.profileVisits){
        const originalData = record.profileVisits;
        createOrUpdateStatsRecord({
          username: user.username,
          date: record.date,
          profileVisits: (originalData + 1)
        }) 
      }else{
        createOrUpdateStatsRecord({
          username: user.username,
          date: record.date,
          profileVisits: 1
        }) 
      }
    }
    statsRecordUpdate();
  }, [])


  return (
    <>
    <br/>
    {!isEditing &&
        <>
          <article className="profile ">
            <div className="content">
              <img className="user-photo" src={userDefaultPhoto} alt="photo" />
              <div className="user-meta">
                <span className="first_name">{user.firstname} </span>
                <span className="last_name">{user.lastname} </span>
                <div>
                  <span className="username">{user.username}</span>
                </div>
              </div>
              <ul className="actions">
                <li>
                  <button className="edit-btn" 
                  onClick={()=>setIsEditing(true)}
                  > edit </button>
                </li>
                <li>
                  <button className="delete-btn" onClick={handleShowAlert}> delete</button>
                </li>
              </ul>
            </div>
          </article>
        </>
        }
        {isEditing && <UpdateInfo setIsEditing={(finish)=>setIsEditing(finish)} />}
      <Modal show={showAlert} onHide={handleCloseAlert} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm to delete your account
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseAlert}>
            Cancel
          </Button>
          <Button variant="danger" onClick={()=>handleDeleteConfrim()}>Confirm</Button>
        </Modal.Footer>
      </Modal>

      <hr />
      <div className="followsSouth">
        <h3 className="headerS">All of Your posts</h3>
        <h6 className="headerS">(not including your replies to other users' posts)</h6>
        <div className="comments-container">
          { rootComments ?  rootComments.rootCommentFromUser && rootComments.rootCommentFromUser.length>0 ? 
            (rootComments.rootCommentFromUser.map((rootComment) => (
              <>
                  <hr />
                  <Comment
                  key={rootComment.id}
                  comment={rootComment}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  addComment={addComment}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                  />
              </>
          ))) : <h6 className="headerS">Empty</h6> : <h2 className="headerS">Loading...</h2>}
        </div>
      </div>
    </>
  )
}

export default MyProfile;
