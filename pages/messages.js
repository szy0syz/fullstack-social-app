import axios from 'axios';
import { parseCookies } from 'nookies';
import React, { useState } from 'react';
import baseUrl from '../utils/baseUrl';
import { Segment, Header, Divider, Comment, Grid, Icon } from 'semantic-ui-react';

function Messages({ chatsData }) {
  const [chats, setChats] = useState(chatsData);

  return <div>{JSON.stringify(chats)}</div>;
}

Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });

    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Messages;
