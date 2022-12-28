import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// --- User ---------------------------------------------------------------------------------------
async function getAllUsers(){
  const response = await axios.get(API_HOST + "/api/users");
  return response.data;
}

async function verifyUser(username, password) {
  const response = await axios.get(API_HOST + "/api/users/login", { params: { username, password } });
  const user = response.data;
  return user;
}

async function findUser(username) {
  const response = await axios.get(API_HOST + `/api/users/select/${username}`);

  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);
  return response.data;
}

async function deleteUser(user) {
  const response = await axios.delete(API_HOST + `/api/users/${user.username}`);
  return response.data;
}

async function updateUser(user) {
  const response = await axios.put(API_HOST + "/api/users/update", user);
  return response.data;
}

async function changePasswordUser(user) {
  const response = await axios.put(API_HOST + "/api/users/changePassword", user);
  return response.data;
}



// --- Post ---------------------------------------------------------------------------------------
async function getRootPosts() {
  const response = await axios.get(API_HOST + "/api/posts");

  return response.data;
}

async function createPost(post) {
  const response = await axios.post(API_HOST + "/api/posts", post);
  return response.data;
}

async function getRootPostsOfUser(rel) {
  const response = await axios.get(API_HOST + `/api/posts/post?username=${rel.username}`);
  return response.data;
}

async function getReplyPosts(post) {
  const response = await axios.get(API_HOST + `/api/posts/reply?id=${post.id}`);
  return response.data;
}

async function deletePost(post) {
  const response = await axios.delete(API_HOST + `/api/posts/${post.id}`);

  return response.data;
}

async function editPost(post) {
  const response = await axios.put(API_HOST + "/api/posts", post);

  return response.data;
}

// --- Follow ---------------------------------------------------------------------------------------
async function checkFollowings(obj) {
  const response = await axios.get(API_HOST + `/api/follows/followingsof/${obj.username}`);

  return response.data;
}

async function checkFollowers(obj) {
  const response = await axios.get(API_HOST + `/api/follows/followersof/${obj.username}`);

  return response.data;
}

async function follow(rel){
  const response = await axios.post(API_HOST + "/api/follows", rel);

  return response.data;
}

async function unFollow(rel){
  const response = await axios.delete(API_HOST + `/api/follows?username=${rel.username}&followedBy=${rel.followedBy}`);

  return response.data;
}


// --- Reaction ---------------------------------------------------------------------------------------
async function getAllReactions(){
  const response = await axios.get(API_HOST + "/api/reaction");
  return response.data;
}

// require: post_id
async function getPostReactions(rel){
  const response = await axios.get(API_HOST + `/api/reaction/select/${rel.post_id}`);
  return response.data;
}

// require: type, creator, post_id, status
async function creatReactions(rel){
  const response = await axios.post(API_HOST + "/api/reaction", rel);
  return response.data;
}

// require: creator, post_id
async function disableReactions(rel){
  const response = await axios.put(API_HOST + "/api/reaction/disable", rel);
  return response.data;
}

// require: creator, post_id
async function deleteReactions(rel){
  const response = await axios.delete(API_HOST + "/api/reaction", rel);
  return response.data;
}

// --- Stats --------------------------------------------------------------------------------------
async function readOneRecord(data){
  const response = await axios.get(API_HOST + `/api/stats-records?username=${data.username}&date=${data.date}`);
  return response.data;
}

async function createOrUpdateStatsRecord(record){
  const response = await axios.post(API_HOST + "/api/stats-records", record);
  return response.data;
}


// --- Helper functions to interact with local storage --------------------------------------------
// function setUser(user) {
//   localStorage.setItem(USER_KEY, JSON.stringify(user));
// }

// function getUser() {
//   return JSON.parse(localStorage.getItem(USER_KEY));
// }

// function removeUser() {
//   localStorage.removeItem(USER_KEY);
// }

function passwordValid(password) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const numChars = /[0-9]/
  const lowerChars = /[a-z]/
  const upperChars = /[A-Z]/
  if (specialChars.test(password) && numChars.test(password) && lowerChars.test(password) && upperChars.test(upperChars)) {
    return true
  } else {
    return false
  }
}

export {
  verifyUser, findUser, createUser, deleteUser, updateUser, changePasswordUser,
  getRootPosts, createPost, getRootPostsOfUser, getReplyPosts, deletePost, editPost,
  checkFollowings , checkFollowers, follow, unFollow,
  getAllReactions, getPostReactions, creatReactions, disableReactions, deleteReactions,
  getAllUsers,
  readOneRecord, createOrUpdateStatsRecord,
  //, // getUser, removeUser
  passwordValid
}
