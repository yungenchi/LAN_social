module.exports = (express, app) => {
    const controller = require("../controllers/reaction.controller.js");
    const router = express.Router();
  
    // Select all reactions info.
    router.get("/", controller.all);
  
    // Select all reactions of one post with post id.
    router.get("/select/:post_id", controller.reactionsOf);
  
    // Create a new reaction relationship.
    router.post("/", controller.create);

    router.put("/disable", controller.disable);

    // Delete a reaction relationship
    router.delete("/", controller.delete);
  
    // Add routes to server.
    app.use("/api/reaction", router);
  };
  