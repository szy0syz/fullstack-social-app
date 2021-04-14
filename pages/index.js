import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../utilsClient/baseUrl';
import CreatePost from '../components/Post/CreatePost';
import CardPost from '../components/Post/CardPost';
import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import { NoPosts } from '../components/Layout/NoData';
import { PostDeleteToastr } from '../components/Layout/Toastr';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  PlaceHolderPosts,
  EndMessage,
} from '../components/Layout/PlaceHolderGroup';
import cookie from 'js-cookie';

function Index({ user, postsData = [], errorLoading }) {
  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);

  useEffect(() => {
    document.title = `Welcome, ${user.name}`;
  }, []);

  // if (posts.length === 0 || errorLoading) return <NoPosts />;

  return (
    <>
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />
        {posts.map((post) => (
          <CardPost
            key={post._id}
            post={post}
            user={user}
            setPosts={setPosts}
            setShowToastr={setShowToastr}
          />
        ))}
      </Segment>
    </>
  );
}

Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Index;
