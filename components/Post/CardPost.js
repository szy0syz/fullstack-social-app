import React, { useState } from 'react';
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Modal,
} from 'semantic-ui-react';
import PostComments from './PostComments';
import CommentInputField from './CommentInputField';
import calculateTime from '../../utilsClient/calculateTime';
import Link from 'next/link';

function CardPost({ post, user, setPosts, setShowToastr }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [error, setError] = useState(null);

  return (
    <>
      <Segment>
        <Card color="teal" fluid>
          <Image
            src={post.picUrl}
            style={{ cursor: 'pontiner' }}
            floated="left"
            wrapped
            ui={false}
            alt="PostImage"
          />
        </Card>
      </Segment>
    </>
  );
}

export default CardPost;
