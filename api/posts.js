/** @format */

const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const authMiddleware = require("../middleware/authMiddleware");

// create a post
router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;
  if (text.length < 1) {
    return res.status(401).send("Content cannot be empty");
  }

  try {
    const newPost = {
      user: req.userId,
      text,
    };

    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;

    const post = await PostModel(newPost).save();

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// get all posts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// Get post by id
router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate("user")
      .populate("comments.user");

    if (!post) return res.status(404).send("Post not found");

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// delete a post
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).send("Post not found");

    const user = await UserModel.findById(userId);

    if (post.user.toString() !== userId) {
      if (user.role === "root") {
        await post.remove();
        return res.status(200).send("Post successfully deleted");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await post.remove();
    return res.status(200).send("Post successfully deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// like a post
router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).send("Post not found");
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;

    if (isLiked) return res.status(401).send("Post already liked");

    await post.likes.unshift({ user: userId });
    await post.save();

    return res.status(200).send("Post liked");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// unlike a post
router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).send("Post not found");
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;

    if (isLiked) return res.status(401).send("Post not liked before");

    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);

    await post.likes.splice(index, 1);
    await post.save();

    return res.status(200).send("Post unliked");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// get all likes
router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) return res.status(404).send("Post not found");

    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
