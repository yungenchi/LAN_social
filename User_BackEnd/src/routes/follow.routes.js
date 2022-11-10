module.exports = (express, app) => {
    const controller = require("../controllers/follow.controller.js");
    const router = express.Router();
  
    // Select all follows info.
    router.get("/", controller.all);
  
    // Select all followers of one user with username.
    router.get("/followersof/:username", controller.followersOf);

    router.get("/followingsof/:username", controller.following);
  
    // Create a new follow relationship.
    router.post("/", controller.create);

    // Delete a follow relationship
    router.delete("/", controller.delete);
  
    // Add routes to server.
    app.use("/api/follows", router);
  };
  