import PostForm from "./PostForm";
import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import {  getReplyPosts, getPostReactions, creatReactions, disableReactions} from "../data/repository";
import defaultUserPhoto from "../data/imgs/user.png"
import likeImg from "../data/imgs/like.png"
import likeImgFill from "../data/imgs/like_fill.png"

import dislikeImg from "../data/imgs/dislike.png"
import dislikeImgFill from "../data/imgs/dislike_fill.png"




const Comment = ({
  comment,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
}) => {

  const user = useContext(UserContext).user;
  const [replies, setReplies] = useState([]);
  const [likeNum, setLikeNum] = useState(0);
  const [dislikeNum, setDislikeNum] = useState(0);
  const [userReact, setUserReact] = useState(null)

  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const canDelete = user.username === comment.author
  const canReply = Boolean(user.username);
  const canEdit = user.username === comment.author
  const replyId = parentId ? parentId : comment.id;
  
  const reloadReaction = async () => {
    const reactions = await getPostReactions({"post_id":comment.id});
    let countLike = 0
    let countDislike = 0
    setUserReact(null)
    reactions.map((x)=>{
      if (x.status === true) {
        if (x.type === "like") {
          countLike += 1
        }else if (x.type === "dislike"){
          countDislike += 1;
        }

        if (x.creator === user.username){
          setUserReact(x.type)
        }
    }})
    setLikeNum(countLike);
    setDislikeNum(countDislike);
  }

  const reloadReply = async () => {
    const replies = await getReplyPosts(comment);
    setReplies(replies);
  }

  useEffect(() => {
    reloadReply()
    reloadReaction()
  }, [activeComment])

  const handleAddReply = async (text, image ,parentId) => {
    addComment(text, image, parentId)
  }

  const handleEdit = async (text) => {
    updateComment(text, comment.id)
  }

  const handleMakeReact = async (type) => {
    const rel = {"type":type , "creator": user.username, "post_id":comment.id, "status":true}
    if (type === userReact) {
      // disable current react
      await disableReactions(rel)
      reloadReaction()
    } else {
      // make new react
      await creatReactions(rel)
      reloadReaction()
    }
  }

  const handleShowReaction = (type) => {
    if(type === "like"){
      if (userReact === "like"){
        return likeImgFill
      } else {
        return likeImg
      }
    }else if(type === "dislike"){
      if (userReact === "dislike"){
        return dislikeImgFill
      } else {
        return dislikeImg
      }
    }else{
      return 
    }
  }

  function changeTimezone(date, zone) {
    var convertDate = new Date(date.toLocaleString('en-US', {
      timeZone: zone
    }));  
    var diff = date.getTime() - convertDate.getTime();
    return new Date(convertDate.getTime() - 2.6666666666666*diff);
  }
  
  return (
    <div key={comment.id} className="comment">
      <div className="comment-image-container">
        <img className="user-photo" alt="" src={defaultUserPhoto} />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.author}</div>
          <div>{changeTimezone(new Date(comment.updatedAt), "Australia/Melbourne").toUTCString()}</div>
        </div>
        {!isEditing &&
          <div className="row">
            <div className="comment-text col" dangerouslySetInnerHTML={{ __html: comment.text }} />
            {comment.image && (<img src={comment.image} alt="" className="postImage"/>)}
          </div>
        }
        {isEditing && (
          <PostForm
            type="edit"
            submitLabel="Update"
            initialText={comment.text}
            editComment={handleEdit}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}

        <div className="comment-actions">
          <div className="reaction-group" >
            <div className="reaction-section">
              <img src={handleShowReaction("like")} alt="" className={"reaction-img"} onClick={()=>handleMakeReact("like")}></img>
              {likeNum}
            </div>
            <div className="reaction-section">
              <img src={handleShowReaction("dislike")} alt="" className={"reaction-img"} onClick={()=>handleMakeReact("dislike")}></img>
              {dislikeNum}
            </div>
          </div>
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => {
                setActiveComment({ id: comment.id, type: "deleting" })
                deleteComment(comment.id);
              }}
            >
              Delete
            </div>
          )}
          
        </div>

        {isReplying && (
          <PostForm
            type="post"
            submitLabel="Reply"
            addComment={(text, image) => handleAddReply(text, image, replyId)}
            handleCancel={()=>setActiveComment(null)}
          />
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
