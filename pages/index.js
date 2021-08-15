/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/Layout/NoData";
import CreatePost from "../components/post/Createpost";
import PostCard from "../components/post/PostCard";
import { PostDeleteToastr } from "../components/Layout/Toastr";

const Index = ({ user, postsData, errorLoading }) => {
  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

 
  return (
    <>
      {showToastr && <PostDeleteToastr />}
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        {posts.length === 0 || errorLoading? <NoPosts />:
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            setPosts={setPosts}
            setShowToastr={setShowToastr}
          />
        ))}

      </Segment>
    </>
  );
};

Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/post`, {
      headers: { Authorization: token },
    });

    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Index;
