/** @format */

import React, { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  Image,
  Modal,
  Popup,
  Segment,
} from 'semantic-ui-react';
import Link from 'next/link';
import PostComments from './PostComments';
import CommentInputField from './CommentInputField';
import calculateTime from '../../utils/calculateTime';
import { deletePost, likePost } from '../../utils/postActions';
import LikesLIst from './LikesLIst';
import ImageModal from './ImageModal';
import NoImageModal from './NoImageModal';

const PostCard = ({ user, post, setPosts, setShowToastr }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  // const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments,
  });

  return (
    <>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          open={showModal}
          closeIcon
          closeOnDimmerClick
        >
          <Modal.Content>
            {post.picUrl ? (
              <ImageModal {...addPropsToModal()} />
            ) : (
              <NoImageModal {...addPropsToModal()} />
            )}
          </Modal.Content>
        </Modal>
      )}

      <Segment basic>
        <Card fluid color="teal">
          {post.picUrl && (
            <Image
              src={post.picUrl}
              alt="..."
              style={{ cursor: 'pointer' }}
              floated="left"
              wrapped
              ui={false}
              onClick={() => setShowModal(true)}
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

            {(user.role === 'root' || post.user._id === user._id) && (
              <>
                <Popup
                  position="top right"
                  on="click"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: 'pointer' }}
                      size="mini"
                      floated="right"
                      alt=""
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
                fontSize: '17px',
                letterSpacing: '0.1px',
                wordSpacing: '0.35px',
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Icon
              name={isLiked ? 'heart' : 'heart outline'}
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
            />

            <LikesLIst
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">{`${likes.length} ${
                    likes.length === 1 ? 'like' : 'likes'
                  }`}</span>
                )
              }
            />

            <Icon
              name="comment outline"
              color="blue"
              style={{ marginLeft: '7px' }}
            />

            {comments.length > 0 &&
              comments.map(
                (comment, index) =>
                  index < 3 && (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}

            {comments.length > 3 && (
              <Button
                content="View more"
                color="teal"
                basic
                circular
                onClick={() => setShowModal(true)}
              />
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
    </>
  );
};

export default PostCard;
