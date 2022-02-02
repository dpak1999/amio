/** @format */

import axios from 'axios';
import cookie from 'js-cookie';
import baseUrl from './baseUrl';
import catchErrors from './catchErrors';

const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: cookie.get('token') },
});

export const followUser = async (
  userToFollowId,
  setLoggedInUserFollowStats
) => {
  try {
    await Axios.post(`/follow/${userToFollowId}`);
    setLoggedInUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }],
    }));
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const unfollowUser = async (
  userToUnfollowId,
  setLoggedInUserFollowStats
) => {
  try {
    await Axios.put(`/unfollow/${userToUnfollowId}`);
    setLoggedInUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (following) => following.user !== userToUnfollowId
      ),
    }));
  } catch (error) {
    alert(catchErrors(error));
  }
};
