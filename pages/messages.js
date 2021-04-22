import axios from "axios";
import { parseCookies } from "nookies";
import React, { useRef, useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import io from "socket.io-client";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { useRouter } from "next/router";
import { NoMessages } from "../components/Layout/NoData";
import Banner from "../components/Messages/Banner";
import MessageInputField from "../components/Messages/MessageInputField";

function Messages({ user, chatsData }) {
  const socket = useRef();
  const router = useRouter();
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });

  // this ref is for persisting the state of query string in url throughout re-renders
  // this ref is the query inside url
  const openChatId = useRef();

  // Connection Use Effect
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }

    // 以 `/messages` 的URL进入时，自动加上当前用户信息
    if (chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit("disconnect");
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    console.log("\n~~connectedUsers", connectedUsers);
  }, [connectedUsers]);

  // Load Message Use Effect
  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.current.on("messagesLoaded", ({ chat }) => {
        // console.log(chat);
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });

        openChatId.current = chat.messagesWith._id;
      });
    };

    if (socket.current) {
      loadMessages();
    }
  }, [router.query.message]);

  // Confirming msg is sent and reveving the messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgSent", ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);
        }

        setChats((prev) => {
          const previousChat = prev.find(
            (chat) => chat.messagesWith === newMsg.receiver
          );
          previousChat.lastMessage = newMsg.msg;
          previousChat.date = newMsg.date;

          return [...prev];
        });
      });
    }
  }, []);

  const sendMsg = (msg) => {
    if (socket.current) {
      socket.current.emit("sendNewMsg", {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg,
      });
    }
  };

  return (
    <>
      <Segment>
        <Header
          icon="home"
          content="Go Back!"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        />

        <Divider hidden />

        <div style={{ marginBottom: "10px" }}>
          <ChatListSearch user={user} chats={chats} setChats={setChats} />
        </div>

        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{ overflow: "auto", maxHeight: "32rem" }}
                  >
                    {chats.map((chat, i) => (
                      <Chat
                        key={i}
                        chat={chat}
                        connectedUsers={connectedUsers}
                        deleteChat={() => {}}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>
              <Grid.Column width={12}>
                {router.query.message && (
                  <>
                    <div
                      style={{
                        overflow: "auto",
                        overflow: "hidden",
                        maxHeight: "35rem",
                        height: "35rem",
                        backgroundColor: "whitesmoke",
                      }}
                    >
                      <>
                        {messages.length > 0 && (
                          <>
                            <div style={{ position: "sticky", top: 0 }}>
                              <Banner bannerData={bannerData} />
                            </div>

                            {messages.map((message, i) => (
                              <Message
                                key={i}
                                message={message}
                                user={user}
                                setMessages={setMessages}
                                messagesWith={openChatId.current}
                                bannerProfilePic={bannerData.profilePicUrl}
                              />
                            ))}
                          </>
                        )}
                      </>
                    </div>
                    <MessageInputField sendMsg={sendMsg} />
                  </>
                )}
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
