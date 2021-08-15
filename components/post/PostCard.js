/** @format */

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  Image,
  Popup,
  Segment,
} from "semantic-ui-react";
import Link from "next/link";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import calculateTime from "../../utils/calculateTime";
import { deletePost, likePost } from "../../utils/postActions";
import LikesLIst from "./LikesLIst";

const PostCard = ({ user, post, setPosts, setShowToastr }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [error, setError] = useState(null);

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  return (
    <div>
      <Segment basic>
        <Card fluid color="teal">
          {post.picUrl && (
            <Image
              src={post.picUrl}
              alt="..."
              style={{ cursor: "pointer" }}
              floated="left"
              wrapped
              ui={false}
            />
          )}

          <Card.Content>
            <Image
              src={post.user.profilePicUrl}
              alt="..."
              floated="left"
              avatar
              circular
            />

            {(user.role === "root" || post.user._id === user._id) && (
              <>
                <Popup
                  position="top right"
                  on="click"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: "pointer" }}
                      size="mini"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure?" />
                  <p>This action is irreversible</p>

                  <Button
                    color="red"
                    icon="trash"
                    content="Delete"
                    onClick={() =>
                      deletePost(post._id, setPosts, setShowToastr)
                    }
                  />
                </Popup>
              </>
            )}

            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.location && <Card.Meta content={post.location} />}

            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Icon
              name={isLiked ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
            />

            <LikesLIst
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">{`${likes.length} ${
                    likes.length === 1 ? "like" : "likes"
                  }`}</span>
                )
              }
            />

            <Icon
              name="comment outline"
              color="blue"
              style={{ marginLeft: "7px" }}
            />

            {comments.length > 0 &&
              comments.map(
                (comment, index) =>
                  index < 3 && (
                    <PostComments
                      key={comment.id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}

            {comments.length > 3 && (
              <Button content="View more" color="teal" basic circular />
            )}

            <Divider hidden />

            <CommentInputField
              postId={post._id}
              user={user}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
    </div>
  );
};

export default PostCard;
