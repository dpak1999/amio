/** @format */

const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");
const ProfileModel = require("../models/ProfileModel");
const authMiddleware = require("../middleware/authMiddleware");

// get profile info
router.get("/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const profile = await ProfileModel.findOne({ user: user._id }).populate(
      "user"
    );

    const profileFollowStats = await FollowerModel.findOne({ user: user._id });

    return res.json({
      profile,
      followersLength:
        profileFollowStats.followers.length > 0
          ? profileFollowStats.followers.length
          : 0,
      followingLength:
        profileFollowStats.following.length > 0
          ? profileFollowStats.followers.length
          : 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// get posts of a user
router.get("/posts/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({
      username: username.toLowerCase(),
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const posts = await PostModel.find({ user: user._id })
      .sort({
        createdAt: -1,
      })
      .populate("user")
      .populate("comments.user");

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// get all followers
router.get("/followers/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await FollowerModel.findOne({
      user: userId,
    }).populate("followers.user");

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.json(user.followers);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// get all following
router.get("/following/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await FollowerModel.findOne({
      user: userId,
    }).populate("following.user");

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.json(user.following);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// follow a user
router.post("/follow/:userToFollowId", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userToFollowId } = req.params;

  try {
    const user = await FollowerModel.findOne({
      user: userId,
    });
    const userToFollow = await FollowerModel.findOne({
      user: userToFollowId,
    });

    if (!user || !userToFollow) {
      return res.status(404).send("User not found");
    }

    const isFollowing =
      user.following.length > 0 &&
      user.following.filter(
        (following) => following.user.toString() === userToFollowId
      ).length > 0;

    if (isFollowing) {
      return res.status(401).send("Already following this user");
    }

    await user.following.unshift({ user: userToFollowId });
    await user.save();

    await user.followers.unshift({ user: userId });
    await user.save();

    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// unfollow a user
router.put("/unfollow/:userToUnfollowId", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userToUnfollowId } = req.params;

  try {
    const user = await FollowerModel.findOne({
      user: userId,
    });
    const userToUnfollow = await FollowerModel.findOne({
      user: userToUnfollowId,
    });

    if (!user || !userToUnfollow) {
      return res.status(404).send("User not found");
    }

    const isFollowing =
      user.following.length > 0 &&
      user.following.filter(
        (following) => following.user.toString() === userToUnfollowId
      ).length === 0;

    if (isFollowing) {
      return res.status(401).send("You are not following this user");
    }

    const removeFollowing = user.following
      .map((following) => following.user.toString())
      .indexOf(userToUnfollowId);

    const removeFollower = userToUnfollow.followers
      .map((follower) => follower.user.toString())
      .indexOf(userId);

    await user.following.splice(removeFollowing, 1);
    await user.save();

    await userToUnfollow.followers.splice(removeFollower);
    await userToUnfollow.save();

    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
