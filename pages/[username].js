/** @format */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import axios from "axios";
import Cookies from "js-cookie";
import { NoProfile } from "../components/Layout/NoData";
import baseUrl from "../utils/baseUrl";

const ProfilePage = ({
  profile,
  followersLength,
  followingLength,
  errorLoading,
  user,
  userFollowStats,
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { username } = router.query;
        const token = Cookies.get("token");

        const res = axios.get(`${baseUrl}/api/profile/posts/${username}`, {
          headers: { Authorization: token },
        });

        setPosts(res.data);
      } catch (error) {
        alert("Error loading posts");
      }
      setLoading(false);
    };

    getPosts();
  }, []);

  if (errorLoading) {
    return <NoProfile />;
  }

  return <div>{router.query.username}</div>;
};

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token },
    });

    const { profile, followersLength, followingLength } = res.data;

    return { profile, followersLength, followingLength };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default ProfilePage;
