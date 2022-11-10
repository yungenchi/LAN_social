import { useState, useEffect, useContext} from "react";
import PostForm from "./PostForm";
import Comment from "./Comment";
import UserContext from "../contexts/UserContext";


import {  getRootPosts, createPost , deletePost, editPost} from "../data/repository";

const Comments = () => {

  const user = useContext(UserContext).user;
  const username = user.username

  const [activeComment, setActiveComment] = useState(null);
  const [rootComments, setRootComments] = useState([]);

  const updateRootComments = async () => {
    const rootComments = await getRootPosts();
    setRootComments(rootComments)
  } 

  useEffect(() => {
    updateRootComments();
  }, []);


  const addComment = async (text, image=null, parentId) => {
    // Have img to post
    if (image){
      const post = {username: username, text:text, parent_post_id: parentId, image: image}
      await createPost(post);
    }else{
      // Don't have img to post
      const post = {username: username, text:text, parent_post_id: parentId}
      await createPost(post);
    }
    setActiveComment(null)
    updateRootComments()
  };

  const updateComment = async (text, commentId) => {
    const post = {id: commentId, text:text}
    await editPost(post);
    updateRootComments();
    setActiveComment(null);
  };

  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      const post = {id: commentId}
      await deletePost(post)
      updateRootComments();
      setActiveComment(null);
    }
  };


  return (
    
    <div className="comments">
      {!activeComment && 
        <PostForm type="post" submitLabel="Post" addComment={addComment} handleCancel={()=>{setActiveComment(null)}}/>
      }
      <hr />
      <h3 className="headerS">The Forum</h3>
      <div className="comments-container">
        {rootComments.length>0 ?( rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
          />
        ))) : <h2 className="headerS">Loading...</h2>}
      </div>
    </div>
  );
};

export default Comments;