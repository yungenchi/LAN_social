const db = require("../database");
const { Op } = require("sequelize");

// Select all root posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll({where: {parent_post_id: null}});

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

// Create a post in the database.
exports.create = async (req, res) => {
  const post = await db.post.create({
    text: req.body.text,
    author: req.body.username,
    parent_post_id: req.body.parent_post_id,
    image: req.body.image
  });

  res.json(post);
};

// Find all root post from user
exports.postsOf = async (req, res) => {
  const posts = await db.post.findAll({where: {author: req.query.username, parent_post_id: null}})
  res.json(posts)
}

// Find all reply post from a post 
exports.repliesOf = async (req, res) => {
  const replies = await db.post.findAll({where: {parent_post_id: req.query.id}})
  res.json(replies)
}

exports.edit = async (req, res) => {
  const editedPost = await db.post.update({text: req.body.text, image: req.body.image}, {
    where:
    {
      id: req.body.id
    }
  }) 

  if(editedPost[0] === 1){
    res.json({msg: "Edit successfully"})
  }else{
    res.json({msg: "Unable to edit this post"})
  }
}

exports.delete = async (req, res) => {
  const deleteRelReactions = await db.reaction.destroy({
    where: {
      post_id: req.params.id
    }
  })
  const delReplies = await db.post.destroy({
    where: {
      parent_post_id: req.params.id 
    }
  })
  const del = await db.post.destroy({
    where: {
      id: req.params.id
    }
  })

  res.json(del)
}
