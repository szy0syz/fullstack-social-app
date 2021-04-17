import axios from 'axios';
import { parseCookies } from 'nookies';
import React, { useRef, useEffect, useState } from 'react';
import baseUrl from '../utils/baseUrl';
import {
  Segment,
  Header,
  Divider,
  Comment,
  Grid,
  Icon,
} from 'semantic-ui-react';
import io from 'socket.io-client';
import Chat from '../components/Chats/Chat';
import ChatListSearch from '../components/Chats/ChatListSearch';
import { useRouter } from 'next/router';
import { NoMessages } from '../components/Layout/NoData';

function Messages({ user, chatsData }) {
  const socket = useRef();
  const router = useRouter();
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }

    // 以 `/messages` 的方式进入时，自动加上当前用户信息
    if (chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect');
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    console.log('~~connectedUsers', connectedUsers);
  }, [connectedUsers])

  return (
    <>
      <Segment>
        <Header
          icon="home"
          content="Go Back!"
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        />

        <Divider hidden />

        <div style={{ marginBottom: '10px' }}>
          <ChatListSearch user={user} chats={chats} setChats={setChats} />
        </div>

        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{ overflow: 'auto', maxHeight: '32rem' }}
                  >
                    {chats.map((chat, i) => (
                      <Chat
                        key={i}
                        chat={chat}
                        connectedUsers={connectedUsers}
                        deleteChat={deleteChat}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <>
            <NoMessages />
          </>
        )}
      </Segment>
    </>
  );
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
