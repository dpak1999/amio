/** @format */

import React, { useState } from "react";
import { Comment, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { deleteComment } from "../../utils/postActions";

const PostComments = ({ comment, user, setComments, postId }) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src={comment.user.profilePicUrl} />

        <Comment.Content>
          <Comment.Author as="a" href={`/${comment.user.username}`}>
            {comment.user.name}
          </Comment.Author>
          <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>
          <Comment.Text>{comment.text}</Comment.Text>
          {(user.role === "root" || comment.user._id === user._id) && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => deleteComment(postId, comment._id, setComments)}
            >
              <Icon disabled={disabled} color="red" name="trash" />
            </div>
          )}
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
};

export default PostComments;
