import React from "react";
import UserContext from "../contexts/UserContext";
import { useState, useEffect, useContext } from "react";
import { deletePost, getAllPosts } from "../data/repository";



function PostManage() {
  const Filter = require('bad-words')
  const filter = new Filter();
  const { user } = useContext(UserContext);
  const [posts, setPost] = useState([]);
  const [profanePosts, setProfanePosts] = useState([])
  const [showProfane, setShowProfane] = useState(false)

  const reloadPostData = async () => {
    const newAllPostData = await getAllPosts();
    setPost(newAllPostData)
  }

  const filterPosts = () => {
    let newProfanePosts = []
    posts.map((post) => {
      if (filter.isProfane(String(post.text))) {
        newProfanePosts.push(post)
      }
    })
    setProfanePosts(newProfanePosts)
  }

  const handleShowProfane = (event) => {
    event.preventDefault()
    reloadPostData()
    filterPosts();
    setShowProfane(!showProfane)
  }

  const handleDeletePost = async (event) => {
    event.preventDefault();
    const post_id = parseInt(event.target.value)
    await deletePost(post_id);
    reloadPostData()
    filterPosts()
  }

  // ----- useffect -------------------------
  useEffect(() => {
    reloadPostData()
    filterPosts()
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts]);


  return (
    <>
      {user &&
      <>
        <button className="btn btn-secondary" onClick={handleShowProfane}> {showProfane? "Show All": "Show Profane"} </button>
        <label className="border border-secondary" style={{ marginLeft: "20px",borderRadius:'5px', padding: "5px"}} > {showProfane? "Profane posts:": "All posts:"} Contain {showProfane? profanePosts.length: posts.length} posts </label>
        {!showProfane && table(posts, handleDeletePost)}
        {showProfane && table(profanePosts, handleDeletePost)}
      </>
      }
    </>
  );
}

export default PostManage;


function table(posts, handleDeletePost) {


  function changeTimezone(date, zone) {
    var convertDate = new Date(date.toLocaleString('en-US', {
      timeZone: zone
    }));
    var diff = date.getTime() - convertDate.getTime();
    return new Date(convertDate.getTime() - 2.6666666666666*diff);
  }

  return (
    <>
          <div style={{ margin: "10px 0", }}>
            <table className="table table-bordered">
              <tr key={0}>
                <td>ID</td>
                <td>Image</td>
                <td>Text</td>
                <td>usernmae</td>
                <td>Create Time</td>
                <td>Update Time</td>
                <td>Options</td>
              </tr>

              {posts.map((item, i) => {
                return (
                  <tr key={i + 1}>
                    <td>{item.id}</td>
                    <td>
                      {item.image &&
                        <img src={item.image} alt="img" width={50} />
                      }
                    </td>
                    <td>{
                      <div className="comment-text col" dangerouslySetInnerHTML={{ __html: item.text }} />
                    }</td>
                    <td>{item.author}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.updatedAt}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-mini"
                        style={{ marginLeft: 10 }}
                        value={item.id}
                        onClick={handleDeletePost}
                      >
                        Delete Post
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </>
  )
}