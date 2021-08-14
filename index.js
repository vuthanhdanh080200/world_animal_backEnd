const express = require("express");
const app = express();
const users = require("./router/users");
const posts = require("./router/posts");
const cors = require("cors");
const debug = require("debug")("app");

const { Post } = require("./model/post");

const corsOptions = {
  exposedHeaders: ["x-auth-token"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/users", users);
app.use("/api/posts", posts);

app.get("/", (req, res) => {
  res.send("HELLO");
});

let post = {
  postId: "3CBE6AB9-7D7A-4CC3-B7FE-DD024E622C72",
  title: "this is a title update of update",
  numVote: 0,
  tags: "this is a tags",
  userId: "538E2F8B-107E-4594-9A9D-2EA3612B7246",
  image: "this is a image",
};

async function run() {
  let result = await Post.delete(post.postId);
  debug("INDEX", result);
}
// debug("INDEX", post);
// run();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  debug(`Listening on ${port} ...`);
});

module.exports = server;
