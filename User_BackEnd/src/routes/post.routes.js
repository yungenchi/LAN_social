module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all root posts.
  router.get("/", controller.all);

  // Create a new post.
  router.post("/", controller.create);

  router.put("/", controller.edit);

  // Find all root post from user
  router.get("/post", controller.postsOf);

  // Find all child post from a post 
  router.get("/reply", controller.repliesOf);

  // Delete a post
  router.delete("/:id", controller.delete);

  // Add routes to server.
  app.use("/api/posts", router);
};
