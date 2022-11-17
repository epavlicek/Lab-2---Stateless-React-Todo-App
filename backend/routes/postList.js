var express = require("express");

const PostList = require("../models/PostList");
const Post = require("../models/Post");

const privateKey = "";
const jwt = require("jsonwebtoken");

var router = express.Router();

router.use(function (req, res, next) {
  console.log(req.header("Authorization"));
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
      console.log(req.payload);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

router.get("/", async function (req, res, next) {
  const postLists = await PostList.find()
    .where("author")
    .equals(req.payload.id)
    .exec();

  const postList = postList.map((postList) => ({
    id: postList._id,
    title: postList.title,
    content: postList.content,
    author: postList.author,
  }));
  return res.status(200).json({ postList: postList });
});

router.get("/:postListId", async function (req, res, next) {
  let post = await Post.find()
    .where("postList")
    .equals(req.params.postListId)
    .exec();

  post = post.map((post) => ({
    id: post._id,
    title: post.title,
    content: post.content,
    dateCreated: post.dateCreated,
    complete: post.complete,
    dateCompleted: post.dateCompleted,
    author: post.author,
    postList: post.postList,
  }));
  return res.status(200).json({ post: post });
});

router.post("/", async function (req, res) {
  const postList = new PostList({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  });

  await postList
    .save()
    .then((savedPostList) => {
      return res.status(201).json({
        id: savedPostList._id,
        title: savedPostList.title,
        content: savedPostList.content,
        author: savedPostList.author,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

router.delete("/", async function (req, res) {
  await PostList.findOneAndDelete({
    _id: req.body.id,
  })
    .exec()
    .then((deletedList) => {
      if (deletedList) {
        Post.deleteMany({
          $and: [{ author: req.body.author }, { postList: req.body.id }],
        })
          .exec()
          .then((deletedPost) => {
            if (deletedPost) {
              return res.status(200).json({ id: req.body.id });
            } else {
              return res.status(500).json({ error: "Unauthorized" });
            }
          });
      } else {
        return res.status(500).json({ error: "Unauthorized" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

module.exports = router;
