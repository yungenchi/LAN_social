const { buildSchema } = require("graphql");
const db = require("../database");
const argon2 = require("../../../User_BackEnd/node_modules/argon2/argon2");
const { sequelize } = require("../database");

const graphql = { };

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.schema = buildSchema(`
  # The GraphQL types are declared first.

  type Admin_user {
    username: String!,
    password_hash: String!,
    firstname: String!,
    lastname: String!
  }

  type User {
    username: String!,
    password_hash: String!,
    firstname: String!,
    lastname: String!,
    blocked: Boolean!
  }

  type Post {
    id: Int,
    text: String!,
    parent_post_id: Int,
    author: String!,
    image: String
    updatedAt: String,
    createdAt: String
  }

  type Reaction {
    id: Int!,
    type: String!,
    creator: String!,
    post_id: Int!,
    status: Boolean!,
  }

  type Follow {
    id: Int!,
    username: String!,
    followedBy: String!
  }

  type UserRecord {
    username: String,
    date: String,
    login: Boolean,
    profileVisits: Int,
    followed: Int
  }

  type ProfileVisitsRecord {
    username: String,
    firstname: String,
    lastname: String,
    visits: Int,
    rank: Int
  }

  type PostRecord {
    post_id: Int,
    reactions: Int,
    rank: Int,
    author: String,
    text: String,
  }

  type FollowedRecord {
    username: String,
    followed: Int,
    rank: Int
  }

  type FollowedUserRecord {
    username: String,
    firstname: String,
    lastname: String,
    followed: Int,
    rank: Int,
  }

  # The input type can be used for incoming data.
  input Admin_UsersInput {
    username: String,
    password_hash: String,
    firstname: String,
    lastname: String,
    blocked: Boolean
  }

  input Admin_User_LoginInput {
    username: String,
    password_hash: String,
    firstname: String,
    lastname: String
  }

  input UserInput {
    username: String,
    password_hash: String,
    firstname: String,
    lastname: String,
    blocked: Boolean
  }

  input PostInput {
    id: Int,
    text: String,
    parent_post_id: Int,
    author: String,
    image: String
  }

  input ReactionInput {
    id: Int,
    type: String,
    creator: String,
    post_id: Int,
    status: Boolean,
  }

  input FollowInput {
    id: Int,
    username: String,
    followedBy: String
  }

  input UserRecordInput {
    username: String,
    login: Boolean,
    profileVisits: Int,
    followed: Int
  }

  # Queries (read-only operations).
  type Query {
    all_admin_users: [Admin_user],
    one_admin_user(username: String): Admin_user,
    admin_user_exists(username: String): Boolean,
    admin_user_login(input: Admin_User_LoginInput): Admin_user,
    all_users: [User],
    one_user(username: String): User,
    all_posts: [Post],
    one_post(id: Int): Post,
    all_follows: [Follow],
    followers_of(username: String): [Follow],
    followings_of(username: String): [Follow],
    all_reactions: [Reaction],
    reactions_of(parent_post_id: Int): [Reaction],
    all_deprecate_posts: [Post], 
    all_users_records: [UserRecord],
    daily_users(date: String): Int,
    top3_likes_posts: [PostRecord],
    top3_dislikes_post: [PostRecord],
    top3_daily_profile_visits(date: String): [ProfileVisitsRecord],
    top3_daily_followed_users(date: String): [FollowedRecord],
    top3_followed_users: [FollowedRecord]
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    create_admin_user(input: Admin_UsersInput): Admin_user,
    update_admin_user(input: Admin_UsersInput): Admin_user,
    delete_admin_user(username: String): Boolean,
    block_user(username: String): User,
    unblock_user(username: String): User,
    delete_post_as_admin(id: Int): Post,
    create_user_record(input: UserRecordInput): UserRecord,
  }
`);

// The root provides a resolver function for each API endpoint.
graphql.root = {
  // Queries.
  all_admin_users: async () => {
    return await db.admin_user.findAll();
  },
  one_admin_user: async (args) => {
    return await db.admin_user.findByPk(args.username);
  },
  admin_user_exists: async (args) => {
    const count = await db.admin_user.count({ where: { username: args.username } });

    return count === 1;
  },
  admin_user_login: async (args) => {
    const admin_user = await db.admin_user.findByPk(args.input.username);
    if (admin_user === null || await argon2.verify(admin_user.password_hash, args.input.password_hash) === false){
      return null;
    }else{
      return admin_user;
    }
  },
  all_users: async () => {
    return await db.user.findAll();
  },
  one_user: async (args) => {
    return await db.user.findByPk(args.username);
  },
  all_posts: async () => {
    return await db.post.findAll();
  },
  one_post: async (args) => {
    return await db.post.findByPk(args.id);
  },
  all_follows: async () => {
    return await db.follow.findAll();
  },
  followers_of: async (args) => {
    return await db.follow.findAll({where: {username: args.username}});
  },
  followings_of: async (args) => {
    return await db.follow.findAll({where: {followedBy: args.username}});
  },
  all_reactions: async () => {
    return await db.reaction.findAll();
  },
  reactions_of: async (args) => {
    return await db.reaction.findAll({where: {post_id: args.parent_post_id}});
  },
  all_deprecate_posts: async () => {
    return await db.deprecate_post.findAll();
  },
  all_users_records: async () => {
    return await db.stats_users.findAll();
  },
  daily_users: async (args) => {
    const recordsList = await db.stats_users.findAll({where: {date: args.date, login: true}})
    return recordsList.length;
  },
  top3_likes_posts: async () => {
    var top3 = [];
    const postReactionsCtList = await db.reaction.findAll({
      attributes: [
        "post_id",
        [sequelize.fn("COUNT", sequelize.col("type")), "ct_likes"],
      ],
      where: {
        type: "like",
        status: true
      },
      group: "post_id",
      order: [
        ["ct_likes", "DESC"]
      ]
    });

    for(let i=0; i<postReactionsCtList.length; ++i){//i=1, l+1
      if(i === 0){
        top3.push({
          post_id: postReactionsCtList[i].post_id,
          likes: postReactionsCtList[i].dataValues.ct_likes,
          rank: i+1
        });
      }else if(i<3){
        top3.push({
          post_id: postReactionsCtList[i].post_id,
          likes: postReactionsCtList[i].dataValues.ct_likes,
          rank: ((postReactionsCtList[i].dataValues.ct_likes === postReactionsCtList[i-1].dataValues.ct_likes) && top3[top3.length-1].rank) || i+1
        });
      }else{
        if(postReactionsCtList[i].dataValues.ct_likes !== postReactionsCtList[i-1].dataValues.ct_likes){
          break;
        }else{
          top3.push({
            post_id: postReactionsCtList[i].post_id,
            likes: postReactionsCtList[i].dataValues.ct_likes,
            rank: top3[top3.length-1].rank
          });
        }
      }
    }
    
    async function getList(){
      var top3_likes_posts_list = [];
      for(const top of top3) {
        var objPost = await db.post.findByPk(top.post_id);
        top3_likes_posts_list.push({
          post_id: top.post_id,
          reactions: top.likes,
          rank: top.rank,
          author: objPost.author,
          text: objPost.text
        });
      }
      return top3_likes_posts_list;
    }
    
    const retList = await getList();

    return retList;
  },
  top3_dislikes_post: async (args) => {
    var top3DislikesPosts = [];
    const postReactionsCtList = await db.reaction.findAll({
      attributes: [
        "post_id",
        [sequelize.fn("COUNT", sequelize.col("type")), "ct_dislikes"],
      ],
      where: {
        type: "dislike",
        status: true
      },
      group: "post_id",
      order: [
        ["ct_dislikes", "DESC"]
      ]
    });
    
    for(let i=0; i<postReactionsCtList.length; ++i){
      if(i === 0){
        top3DislikesPosts.push({
          post_id: postReactionsCtList[i].post_id,
          dislikes: postReactionsCtList[i].dataValues.ct_dislikes,
          rank: i+1
        });
      }else if(i<3){
        top3DislikesPosts.push({
          post_id: postReactionsCtList[i].post_id,
          dislikes: postReactionsCtList[i].dataValues.ct_dislikes,
          rank: ((postReactionsCtList[i].dataValues.ct_dislikes === postReactionsCtList[i-1].dataValues.ct_dislikes) && top3DislikesPosts[top3DislikesPosts.length-1].rank) || i+1
        });
      }else{
        if(postReactionsCtList[i].dataValues.ct_dislikes !== postReactionsCtList[i-1].dataValues.ct_dislikes){
          break;
        }else{
          top3DislikesPosts.push({
            post_id: postReactionsCtList[i].post_id,
            dislikes: postReactionsCtList[i].dataValues.ct_dislikes,
            rank: top3DislikesPosts[top3DislikesPosts.length-1].rank
          });
        }
      }
    }
    
    async function getList(){
      var top3_dislikes_posts_list = [];
      for(const top of top3DislikesPosts) {
        var objPost = await db.post.findByPk(top.post_id);
        top3_dislikes_posts_list.push({
          post_id: top.post_id,
          reactions: top.dislikes,
          rank: top.rank,
          author: objPost.author,
          text: objPost.text
        });
      }
      return top3_dislikes_posts_list;
    }
    
    const retList = await getList();

    return retList;
  },
  top3_daily_profile_visits: async (args) => {
    var top3 = [];
    const records = await db.stats_users.findAll({
      where: {
        date: args.date
      },
      order: [
        ["profileVisits", "DESC"]
      ]
    });

    for(let i=0; i<records.length; ++i){
      if(records[i].dataValues.profileVisits != null && records[i].dataValues.profileVisits > 0){
        if(i === 0){
          top3.push({
            username: records[i].dataValues.username,
            visits: records[i].dataValues.profileVisits,
            rank: i+1
          });
        }else if(i<3){
          top3.push({
            username: records[i].dataValues.username,
            visits: records[i].dataValues.profileVisits,
            rank: ((records[i].dataValues.profileVisits === records[i-1].dataValues.profileVisits) && top3[top3.length-1].rank) || i+1
          });
        }else{
          if(records[i].dataValues.profileVisits !== records[i-1].dataValues.profileVisits){
            break;
          }else{
            top3.push({
              username: records[i].dataValues.username,
              visits: records[i].dataValues.profileVisits,
              rank: top3[top3.length-1].rank
            });
          }
        }
      }
    }

    async function retList(){
      const top3_profiles_visits = [];
      for(const top of top3) {
        const user = await db.user.findByPk(top.username);
        records.forEach(record => {
          if(record.username === user.username){
            top3_profiles_visits.push({
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              visits: top.visits,
              rank: top.rank
            });
          }
        })
      }
      return top3_profiles_visits;
    }

    return await retList();
  },
  top3_daily_followed_users: async (args) => {
    var top3 = [];

    const records = await db.stats_users.findAll({
      where: {
        date: args.date
      },
      order: [
        ["followed", "DESC"]
      ]
    });

    for(let i=0; i<records.length; ++i){
      if(records[i].dataValues.ct_followed != null && records[i].dataValues.ct_followed > 0){
        if(i === 0){
          top3.push({
            username: records[i].dataValues.username,
            followed: records[i].dataValues.ct_followed,
            rank: i+1
          });
        }else if(i<3){
          top3.push({
            username: records[i].dataValues.username,
            followed: records[i].dataValues.ct_followed,
            rank: ((records[i].dataValues.ct_followed === records[i-1].dataValues.ct_followed) && top3[top3.length-1].rank) || i+1
          });
        }else{
          if(records[i].dataValues.ct_followed !== records[i-1].dataValues.ct_followed){
            break;
          }else{
            top3.push({
              username: records[i].dataValues.username,
              followed: records[i].dataValues.ct_followed,
              rank: top3[top3.length-1].rank
            });
          }
        }
      }
    }

    return top3;
  },
  top3_followed_users: async (args) => {
    var top3 = [];
    //dblist
    const records = await db.follow.findAll({
      attributes: [
        "username",
        [sequelize.fn("COUNT", sequelize.col("followedBy")), "ct_followed"],
      ],
      group: "username",
      order: [
        ["ct_followed", "DESC"]
      ]
    });
    
    for(let i=0; i<records.length; ++i){
      if(records[i].dataValues.ct_followed && records[i].dataValues.ct_followed > 0){
        if(i === 0){
          top3.push({
            username: records[i].dataValues.username,
            followed: records[i].dataValues.ct_followed,
            rank: i+1
          });
        }else if(i<3){
          top3.push({
            username: records[i].dataValues.username,
            followed: records[i].dataValues.ct_followed,
            rank: ((records[i].dataValues.ct_followed === records[i-1].dataValues.ct_followed) && top3[top3.length-1].rank) || i+1
          });
        }else{
          if(records[i].dataValues.ct_followed !== records[i-1].dataValues.ct_followed){
            break;
          }else{
            top3.push({
              username: records[i].dataValues.username,
              followed: records[i].dataValues.ct_followed,
              rank: top3[top3.length-1].rank
            });
          }
        }
      }
    }

    return top3;
  },

  // Mutations.
  create_admin_user: async (args) => {
    const admin_user = await db.admin_user.create(args.input);

    return admin_user;
  },
  update_admin_user: async (args) => {
    const admin_user = await db.admin_user.findByPk(args.input.username);
  
    // Update owner fields.
    admin_user.firstname = args.input.firstname;
    admin_user.lastname = args.input.lastname;

    await admin_user.save();

    return admin_user;
  },
  delete_admin_user: async (args) => {
    const admin_user = await db.admin_user.findByPk(args.username);
  
    if(admin_user === null)
      return false;

    await admin_user.destroy();

    return true;
  },
  block_user: async (args) => {
    const user = await db.user.findByPk(args.username);

    user.blocked = true;
    await user.save();

    return user;
  },
  unblock_user: async (args) => {
    const user = await db.user.findByPk(args.username);
    user.blocked = false;
    await user.save();
    return user;
  },
  delete_post_as_admin: async (args) => {
    // deprecated_posts' controller
    const post = await db.post.findByPk(args.id);
    await db.deprecate_post.create({
      id: post.id,
      text: post.text,
      parent_post_id: post.parent_post_id,
      author: post.author,
    })
    await db.post.update({text: "<p style='color:red'><b><i>[**** This post has been deleted by the admin ***]</i></b></p>", image: null}, {
      where: {
        id: args.id
      }
    })
    return post;
  },
  create_user_record: async (args) => {
    const user_record_created_Or_updated = await db.stats_users.upsert({
      username: args.input.username,
      login: args.input.login,
      profileVisits: args.input.profileVisits,
      followed: args.input.followed
    })
    return user_record_created_Or_updated[0].dataValues;
  }
};

module.exports = graphql;