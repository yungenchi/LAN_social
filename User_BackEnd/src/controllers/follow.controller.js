const db = require("../database");

// Select all follows info from the database.
exports.all = async (req, res) => {
  const follows = await db.follow.findAll();

  res.json(follows);
};

// Select the followers of one user from the database.
exports.followersOf = async (req, res) => {
  const followers = await db.follow.findAll({where: {username: req.params.username}});

  res.json(followers);
};

// Select the following users of one user from the database.
exports.following = async (req, res) => {
  const followings = await db.follow.findAll({where: {followedBy: req.params.username}});
  res.json(followings)
}

// Create a follow relationship between two users in the database.
exports.create = async (req, res) => {
  
  const follow = await db.follow.create({
    username: req.body.username,
    followedBy: req.body.followedBy,
  });

  res.json(follow);
};

// Delete a follow relationship between two users in the database.
exports.delete = async (req, res) => {
  const del = await db.follow.destroy({
    where: {
      username: req.query.username,
      followedBy: req.query.followedBy
    }
  })

  res.json(del)
}
