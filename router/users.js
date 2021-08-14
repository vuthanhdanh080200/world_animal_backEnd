const express = require("express");
const router = express.Router();
const { User, validate } = require("../model/user");
const jwt = require("jsonwebtoken");
const debug = require("debug")("app");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const { username } = req.user;
  const user = await User.getUserByUsername(username);
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.getUserByUsername(req.body.username);
  if (!user.username || user.password !== req.body.password)
    return res.status(400).send(new Error("Incorrect username or password"));

  const token = User.generateAuthToken(user);

  const response = {
    userId: user.userId,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
  res.header("x-auth-token", token).send(response);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.create(req.body);
  const token = User.generateAuthToken(user);
  const response = {
    userId: user.userId,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
  res.header("x-auth-token", token).send(response);
});

router.put("/:userId", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = {
    userId: req.params.userId,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
  };

  user = await User.update(user);
  if (!user.username) return res.status(400).send(new Error("Incorrect user"));
  const response = {
    userId: user.userId,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
  res.send(response);
});

router.delete("/:userId", auth, async (req, res) => {
  const result = await User.delete(req.params.userId);
  if (!result) return res.status(400).send(new Error("Incorrect userId"));
  res.send(`delete ${req.params.userId} success!`);
});

module.exports = router;
