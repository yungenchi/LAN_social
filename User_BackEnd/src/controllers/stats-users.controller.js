const db = require("../database");

// Create or Update the stats record
exports.createOrUpdate = async (req, res) => {

  const user_record_created_Or_updated = await db.stats_users.upsert({
    username: req.body.username,
    login: req.body.login,
    profileVisits: req.body.profileVisits,
    followed: req.body.followed
  });

  res.json(user_record_created_Or_updated);
};

// Read one specific record of a user with a date
exports.readRecord = async (req, res) => {
  const record = await db.stats_users.findOne(
    {
      where: {
        username: req.query.username,
        date: req.query.date
      }
    }
  );

  res.json(record)
};
