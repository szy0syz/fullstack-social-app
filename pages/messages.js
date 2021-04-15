import axios from 'axios';
import { parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react';
import baseUrl from '../utils/baseUrl';
import {
  Segment,
  Header,
  Divider,
  Comment,
  Grid,
  Icon,
} from 'semantic-ui-react';
import Chat from '../components/Chats/Chat';
import ChatListSearch from '../components/Chats/ChatListSearch';
import { useRouter } from 'next/router';
import { NoMessages } from '../components/Layout/NoData';

function Messages({ chatsData }) {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();

  useEffect(() => {
    if (chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }
  }, []);

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
