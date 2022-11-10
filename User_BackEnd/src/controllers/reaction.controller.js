const db = require("../database");

// Select all reactions info from the database.
exports.all = async (req, res) => {
  const reactions = await db.reaction.findAll();

  res.json(reactions);
};

// Select the reactions of one post from the database.
exports.reactionsOf = async (req, res) => {
  const reactions = await db.reaction.findAll({where: {post_id: req.params.post_id}});

  res.json(reactions);
};

// Create a reaction relationship between a post and a user in the database.
exports.create = async (req, res) => {
  var reaction = null;
  const existedReaction = await db.reaction.findAll({where: {creator: req.body.creator, post_id: req.body.post_id}})
  if (existedReaction.length > 0){
    reaction = await db.reaction.update({type: req.body.type, status: true}, {
      where: {
        creator: req.body.creator,
        post_id: req.body.post_id
      }
    })
  }else{
    reaction = await db.reaction.create({
      // like: true,
      type: req.body.type,
      creator: req.body.creator,
      post_id: req.body.post_id,
      status: req.body.status
    });
  }
  

  res.json(reaction);
};

exports.disable = async (req, res) => {
    const reaction = await db.reaction.update({status : false}, {
        where: {
            creator: req.body.creator,
            post_id: req.body.post_id
        }
    })

    res.json(reaction)
}

exports.delete = async (req, res) => {
    const del = await db.reaction.destroy({
        where: {
            creator: req.query.creator,
            post_id: req.query.post_id
        }
    })

    res.json(del)
}
