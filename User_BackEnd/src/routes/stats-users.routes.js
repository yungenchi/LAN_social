module.exports = (express, app) => {
    const controller = require("../controllers/stats-users.controller.js");
    const router = express.Router();

    router.get("/", controller.readRecord);
  
    // Select all follows info.
    router.post("/", controller.createOrUpdate);
  
    // Add routes to server.
    app.use("/api/stats-records", router);
  };
  