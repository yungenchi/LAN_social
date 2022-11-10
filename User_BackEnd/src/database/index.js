const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
  timezone: "+11:00", // under Daylight Saving Time, should be +10 after the end of DST
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.js")(db.sequelize, DataTypes);
db.reaction = require("./models/reaction.js")(db.sequelize, DataTypes);
db.stats_users = require("./models/stats_users.js")(db.sequelize, DataTypes);

// Set up foreign-keys
db.post.belongsTo(db.user, { foreignKey: { name: "author", allowNull: false } });
db.post.belongsTo(db.post, { foreignKey: { name: "parent_post_id", allowNull: true }})
db.follow.belongsTo(db.user, { foreignKey: { name: "username", allowNull: false } });
db.follow.belongsTo(db.user, { foreignKey: { name: "followedBy", allowNull: false } });
db.reaction.belongsTo(db.post, { foreignKey: { name: "post_id", allowNull: false } });
db.reaction.belongsTo(db.user, { foreignKey: { name: "creator", allowNull: false } });



// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });
  
  await seedData();
};

async function seedData() {
  const userCount = await db.user.count();
  const postCount = await db.post.count();
  const folwCount = await db.follow.count();
  const reacCount = await db.reaction.count();

  const argon2 = require("argon2");
  // Only seed data if necessary.

  if(userCount === 0){
    // User seed
    let hash = await argon2.hash("0000", { type: argon2.argon2id });
    await db.user.create({ username: "ian000", password_hash: hash, firstname: "ian", lastname : "chi" });

    hash = await argon2.hash("0000", { type: argon2.argon2id });
    await db.user.create({ username: "zico000", password_hash: hash, firstname: "zico", lastname : "zhong" });
  }

  // Post seed
  if(postCount === 0){
    await db.post.create({text: "This is the first post.", author: "ian000"});
    await db.post.create({text: "This is a reply to the first post.", author: "zico000", parent_post_id: 1});
  }

  // Follow seed
  if(folwCount === 0){
    await db.follow.create({username: "ian000", followedBy: "zico000"});
  }

  // reaction seed
  if(reacCount === 0){
    await db.reaction.create({post_id: 1, creator: "zico000", type: "like", status: true});
  }

}

module.exports = db;
