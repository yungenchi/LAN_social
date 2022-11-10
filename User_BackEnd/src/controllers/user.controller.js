const db = require("../database");
const argon2 = require("argon2");
const { Op } = require("sequelize");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);

  res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.username);

  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
    // Login failed.
    res.json(null);
  else
    res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  
  const user = await db.user.create({
    username: req.body.username,
    password_hash: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    blocked: false
  });

  res.json(user);
};

exports.update = async ( req, res ) => {
  const ret = await db.user.update(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    },
    {
      where: {
        username: req.body.username
      }
    }
  )

  if(ret[0] === 1){
    res.json({msg: "Update successfully"})
  }else{
    res.json({msg: "Update failed"})
  }
}

exports.changePassword = async (req, res) => {
  const hashPassword = await argon2.hash(req.body.password, { type: argon2.argon2id });
  const ret = await db.user.update({password_hash: hashPassword}, {
    where: {
      username: req.body.username
    }
  })

  if(ret[0] === 1){
    res.json({msg: "Change successfully"})
  }else{
    res.json({msg: "Change failed"})
  }
}

exports.block = async (req, res) => {
  const existed = await db.user.count({
    where: {
      username: req.body.username
    }
  }) === 1;
  const block = await db.user.update({blocked: true}, {
    where: {
      username: req.body.username
    }
  })

  if(existed){
    res.json(block)
  }else{
    res.json({error: "User not found"})
  }
}

exports.unblock = async (req, res) => {
  const unblock = await db.user.update({blocked: false}, {
    where: {
      username: req.body.username
    }
  })

  res.json(unblock)
}

exports.delete = async (req, res) => {
  await db.post.destroy({
    where: {
      author: req.params.username
    }
  })

  await db.follow.destroy({
    where: {
      // username: req.body.username,
      // $or: [
      //   {
      //     followedBy: {$eq: req.body.username}
      //   }
      // ]
      [Op.or]: [
        { username: req.params.username },
        { followedBy: req.params.username }
      ]
    }
  })

  await db.reaction.destroy({
    where: {
      creator: req.params.username
    }
  })

  const delNum = await db.user.destroy({
    where: {
      username: req.params.username
    }
  })

  if(delNum === 1){
    res.json({msg: "Delete successfully"})
  }else{
    res.json({msg: "Unable to delete"})
  }
}
