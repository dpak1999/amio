/** @format */

const express = require("express");
const bcrypt = require("bcryptjs");
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

    user.following.unshift({ user: userToFollowId });
    await user.save();

    userToFollow.followers.unshift({ user: userId });
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

    user.following.splice(removeFollowing, 1);
    await user.save();

    userToUnfollow.followers.splice(removeFollower, 1);
    await userToUnfollow.save();

    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// update profile
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { bio, facebook, youtube, twitter, instagram, profilePicUrl } =
      req.body.user;

    let profileFields = {};
    profileFields.user = userId;
    profileFields.bio = bio;
    profileFields.social = {};

    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;

    await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true }
    );

    if (profilePicUrl) {
      const user = await UserModel.findById(userId);
      user.profilePicUrl = profilePicUrl;
      await user.save();
    }

    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// update password
router.post("/settings/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res.status(401).send("Password must be atleast 6 characters");
    }

    const user = await UserModel.findById(req.userId).select("+password");
    const isPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid password");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

// update popup message settings
router.post("/settings/messagePopup", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (user.newMessagePopup) {
      user.newMessagePopup = false;
      await user.save();
    } else {
      user.newMessagePopup = true;
      await user.save();
    }

    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
