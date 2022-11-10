import { request, gql } from "graphql-request";

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = "http://localhost:4001/graphql";

// --- Admin ---------------------------------------------------------------------------------------
async function getAdmins() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_admin_users {
        username,
        firstname,
        lastname
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_admin_users;
}

async function getAdmin(username) {
  // Query with parameters (variables).
  const query = gql`
    query ($username: String) {
      one_admin_user(username: $username) {
        username,
        firstname,
        lastname
      }
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.one_admin_user;
}

async function getAdminExists(username) {
  const query = gql`
    query ($username: String) {
      admin_user_exists(username: $username)
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.admin_user_exists;
}

async function verifyAdminUser(username, password_hash){
  const query = gql`
    query ($username: String, $password_hash: String) {
      admin_user_login(input: {
        username: $username,
        password_hash: $password_hash
      }) {
        username,
        firstname,
        lastname
      }
    }
  `;

  const variables = { username, password_hash };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.admin_user_login;
}

async function getAllUsers() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_users {
        username,
        firstname,
        lastname,
        blocked
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);
  return data.all_users;
}

async function getUser(username) {
  // Query with parameters (variables).
  const query = gql`
    query ($username: String) {
      one_user(username: $username) {
        username,
        firstname,
        lastname,
        blocked
      }
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.one_user;
}

async function getAllPosts() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_posts {
        id,
        text,
        parent_post_id,
        author,
        createdAt,
        updatedAt,
        image,
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_posts;
}

async function getPost(id) {
  // Query with parameters (variables).
  const query = gql`
    query ($id: Int) {
      one_post(id: $id) {
        id,
        text,
        parent_post_id,
        author,
        image
      }
    }
  `;

  const variables = { id };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.one_post;
}

async function getAllFollows() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_follows {
        username,
        followedBy
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_follows;
}

async function getFollowersOf(username) {
  // Query with parameters (variables).
  const query = gql`
    query ($username: String) {
      followers_of(username: $username) {
        followedBy
      }
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.followers_of;
}

async function getFollowingsOf(username) {
  // Query with parameters (variables).
  const query = gql`
    query ($username: String) {
      followings_of(username: $username) {
        username
      }
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.followings_of;
}

async function getAllReactions() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_reactions {
        type,
        creator,
        post_id,
        status
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_reactions;
}

async function getReactionOf(post_id) {
  // Query with parameters (variables).
  const query = gql`
    query ($post_id: Int) {
      reactions_of(parent_post_id: $post_id) {
        type,
        creator,
        post_id,
        status
      }
    }
  `;

  const variables = { post_id };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.reactions_of;
}

async function getAllDeprecatedPosts() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_deprecate_posts {
        id,
        text,
        parent_post_id,
        author
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_deprecate_posts;
}

async function getAllRecords(){
  const query = gql`
    {
      all_users_records {
        username,
        date,
        login,
        profileVisits,
        followed
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_deprecate_posts;
}

async function getDailyUsers(date){
  const query = gql`
    query ($date: String) {
      daily_users(date: $date)
    }
  `;

  const variables = { date };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.daily_users;
}

async function getTop3PostsWithMostLikes(){
  const query = gql`
    {
      top3_likes_posts {
        post_id,
        reactions,
        rank,
        author,
        text
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.top3_likes_posts;
}

async function getTop3PostsWithMostDislikes(){
  const query = gql`
    {
      top3_dislikes_post {
        post_id,
        reactions,
        rank,
        author,
        text
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.top3_dislikes_post;
}

async function getTop3UsersWithMostDailyProfileVisits(date){
  const query = gql`
    query ($date: String) {
      top3_daily_profile_visits(date: $date) {
        username,
        visits,
        rank
      }
    }
  `;

  const variables = { date };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.top3_daily_profile_visits;
}

async function getTop3UsersWithMostFollowedUsersOn(date){
  const query = gql`
    query ($date: String) {
      top3_daily_followed_users(date: $String) {
        username,
        followed,
        rank
      }
    }
  `;

  const variables = { date };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.top3_daily_followed_users;
}

async function getTop3UsersWithMostFollowedUsers(){
  const query = gql`
    query ($date: String) {
      top3_followed_users {
        username,
        followed,
        rank,
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.top3_followed_users;
}

async function createAdmin(admin) {
  const query = gql`
    mutation ($username: String, $password_hash: String, $firstname: String, $lastname: String) {
      create_admin_user(input: {
        username: $username,
        password_hash: $password_hash,
        firstname: $firstname,
        lastname: $lastname
      }) {
        username,
        password_hash,
        firstname,
        lastname
      }
    }
  `;

  const variables = admin;

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.create_admin_user;
}

async function updateAdmin(admin) {
  const query = gql`
    mutation ($username: String, $password_hash: String, $firstname: String, $lastname: String) {
      update_admin_user(input: {
        username: $username,
        password_hash: $password_hash,
        firstname: $firstname,
        lastname: $lastname
      }) {
        username,
        password_hash,
        firstname,
        lastname
      }
    }
  `;

  const variables = admin;

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.update_admin_user;
}

async function deleteAdmin(username) {
  const query = gql`
    mutation ($username: String) {
      delete_admin_user(username: $username)
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.delete_admin_user;
}

async function blockUser(username) {
  const query = gql`
    mutation ($username: String) {
      block_user(username: $username) {
        username,
        blocked
      }
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.block_user;
}

async function unblockUser(username) {
  const query = gql`
    mutation ($username: String) {
      unblock_user(username: $username){
        username,
        blocked
      }
    }
  `;

  const variables = { username };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.unblock_user;
}

async function deletePost(id){
  const query = gql`
    mutation ($id: Int) {
      delete_post_as_admin(id: $id) {
        id,
        text
      }
    }
  `;

  const variables = { id };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.delete_post_as_admin;
}

async function createOrUpdateAnalyticalRecord(statsRecord){
  const query = gql`
    mutation ($username: String, $date: String, $login: Boolean, $profileVisits: Int, $followed: Int) {
      create_user_record(input: {
        username: $username,
        login: $login,
        profileVisits: $profileVisits,
        followed: $followed
      }) {
        username,
        login,
        profileVisits,
        followed
      }
    }
  `;

  const variables = statsRecord;

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.create_user_record;
}

export {
  getAdmins, getAdmin, getAdminExists, verifyAdminUser, 
  getAllUsers, getUser, 
  getAllPosts, getPost, 
  getAllFollows, getFollowersOf, getFollowingsOf,
  getAllReactions, getReactionOf,
  getAllDeprecatedPosts,
  getAllRecords, getDailyUsers,
  getTop3PostsWithMostLikes, getTop3PostsWithMostDislikes,
  getTop3UsersWithMostDailyProfileVisits,
  getTop3UsersWithMostFollowedUsers,
  createAdmin, updateAdmin, deleteAdmin,
  blockUser, unblockUser,
  deletePost,
  createOrUpdateAnalyticalRecord
}
