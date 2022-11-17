const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const privateKey = ``;
const router = express.Router();

router.get("/:postId", async function (req, res, next) {
  let post = await Post.findOne().where("_id").equals(req.params.postId).exec();
  post = {
    id: post._id,
    title: post.title,
    content: post.content,
    dateCreated: post.dateCreated,
    complete: post.complete,
    dateCompleted: post.dateCompleted,
    author: post.author,
    postList: post.postList,
  };
  return res.status(200).json(post);
});

/*router.use(function (req, res, next) {
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
    } catch (error) {
      /// log the
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();*/
router.use(function (req, res, next) {
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
  const post = await Post.find().where("author").equals(req.payload.id).exec();

  const postList = post.map((post) => ({
    id: post._id,
    title: post.title,
    content: post.content,
    dateCreated: post.dateCreated,
    complete: post.complete,
    dateCompleted: post.dateCompleted,
    author: post.author,
    postList: post.postList,
  }));
  return res.status(200).json({ post: postList });
});

router.post("/", async function (req, res) {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    dateCreated: req.body.dateCreated,
    complete: req.body.complete,
    dateCompleted: req.body.dateCompleted,
    author: req.body.author,
    postList: req.body.postList,
  });

  await post
    .save()
    .then((savedPost) => {
      return res.status(201).json({
        id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        dateCreated: savedPost.dateCreated,
        complete: savedPost.complete,
        dateCompleted: savedPost.dateCompleted,
        author: savedPost.author,
        postList: savedPost.postList,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

router.patch("/", async function (req, res) {
  await Post.findOneAndUpdate(
    { $and: [{ _id: req.body.id }, { author: req.body.author }] },
    { complete: req.body.complete, dateCompleted: req.body.dateCompleted },
    { new: true }
  )
    .exec()
    .then((updatedPost) => {
      return res.status(200).json({
        id: updatedPost._id,
        complete: updatedPost.complete,
        dateCompleted: updatedPost.dateCompleted,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Unauthorized" + error.message });
    });
});

router.delete("/", async function (req, res) {
  await Post.findOneAndDelete({
    $and: [{ _id: req.body.id }, { author: req.body.author }],
  })
    .exec()
    .then((deletedPost) => {
      if (deletedPost) {
        return res.status(200).json({ id: req.body.id });
      } else {
        return res.status(500).json({ error: "Unauthorized" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

module.exports = router;

/*
});
router.post("/", async function (req, res) {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.payload.id,
  });
  return post
    .save()
    .then((savedPost) => {
      return res.status(201).json({
        _id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        author: savedPost.author,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Something is went wrong." });
    });
});

router.get("/", async function (req, res, next) {
  const posts = await Post.find().where("author").equals(req.payload.id).exec();
  //const posts = await Post.find().exec();
  return res.status(200).json({ posts: posts });
});

router.get("/:id", async function (req, res, next) {
  const post = await Post.findOne().where("_id").equals(req.params.id).exec();
  //const posts = await Post.find().exec();
  return res.status(200).json(post);
});

module.exports = router;*/
