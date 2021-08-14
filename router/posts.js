const express = require("express");
const router = express.Router();
const { Post, validate } = require("../model/post");
const jwt = require("jsonwebtoken");
const debug = require("debug")("posts-route");
const auth = require("../middleware/auth");

router.get("/:offset", async (req, res) => {
  const offset = parseInt(req.params.offset);
  if (isNaN(offset)) return res.status(400).send(new Error("Incorrect offset"));
  const posts = await Post.getPostsByOffsetOrderByNumVote(offset);
  debug("OFFSET", posts, offset);
  res.send(posts);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(new Error("Incorrect create post"));
  req.body["userId"] = req.user.userId;
  const post = await Post.create(req.body);
  debug("POST", post);
  res.send(post);
});

router.put("/:postId", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(new Error("Incorrect update post"));
  const post = await Post.update(req.params.postId, req.body);
  debug("UPDATE", post);
  if (!post.postId)
    return res.status(400).send(new Error("Not found post with this postId"));
  res.send(post);
});

router.delete("/:postId", auth, async (req, res) => {
  const result = await Post.delete(req.params.postId);
  debug("DELETE", result);

  if (!result)
    return res.status(400).send(new Error("Not found post with this postId"));
  res.send(result);
});

router.get("/upvote/:postId", auth, async (req, res) => {
  console.log(req.params.postId);
  const result = await Post.upVote(req.params.postId);
  debug("Up vote", result);
  if (!result)
    return res.status(400).send(new Error("Not found post with this postId"));
  res.send(result);
});

router.get("/downvote/:postId", auth, async (req, res) => {
  const result = await Post.downVote(req.params.postId);
  debug("Down vote", result);
  if (!result)
    return res.status(400).send(new Error("Not found post with this postId"));
  res.send(result);
});

module.exports = router;
