var express = require("express");
var router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");

router.get("/", async function (req, res, next) {
  const users = await User.find().exec();

  usersList = users.map((user) => ({
    id: user._id,
    username: user.username,
    post: user.post,
  }));
  return res.status(200).json({ users: usersList });
});

router.get("/:userId", async function (req, res, next) {
  const post = await Post.find()
    .where("author")
    .equals(req.params.userId)
    .exec();

  postList = post.map((post) => ({
    id: post._id,
    title: post.title,
    content: post.content,
    dateCreated: post.dateCreated,
    complete: post.complete,
    dateCompleted: post.dateCompleted,
    author: post.author,
  }));
  return res.status(200).json({ post: postList });
});

module.exports = router;
