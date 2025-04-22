import React, { useState, useEffect, FormEvent, useRef, UIEvent } from 'react';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Base from './Base';
import { useKeycloak } from '../hooks/useKeycloak';
import { useUserSearch, UserOption } from '../hooks/useUserSearch';

interface MessageResponse {
  message_id: number;
  thread_id: number;
  hasActiveMessage: boolean;
  text: string;
  timeStamp: string;
}

interface ThreadResponse {
  thread_id: number;
  receivingUser: number;
  sendingUser: number;
  messages: MessageResponse[];
}

interface UserResponse {
  user_id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Messaging() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { keycloak, authenticated } = useKeycloak();
  const [userId, setUserId] = useState<number | null>(null);
  const [userMap, setUserMap] = useState<Record<number, UserResponse>>({});
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [activeThread, setActiveThread] = useState<ThreadResponse | null>(null);
  const [messagePage, setMessagePage] = useState(1);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [recipientQuery, setRecipientQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const { options: userOptions, loading: loadingUsers } = useUserSearch(recipientQuery);
  const [newMessageText, setNewMessageText] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Resolve user_id from /me endpoint using kc_id
  const fetchUserId = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${keycloak?.token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to resolve user info:", await res.text());
        return;
      }
      const user: UserResponse = await res.json();
      setUserId(user.user_id);
    } catch (error) {
      console.error("Error fetching user ID from /me:", error);
    }
  };

  //fetch user info by id
  const fetchUserInfo = async (userId: number) => {
    if (userMap[userId]) return; // already cached
  
    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${keycloak?.token}`
        }
      });
  
      if (!res.ok) {
        console.error(`Failed to fetch user ${userId}:`, await res.text());
        return;
      }
  
      const user: UserResponse = await res.json();
      setUserMap((prev) => ({ ...prev, [userId]: user }));
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Fetch all threads for the resolved user_id
  const fetchThreads = async () => {
    if (!userId) return;

    const url = `http://localhost:8000/api/v1/threads/${userId}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${keycloak?.token}`
        }
      });

      const raw = await res.text();
      if (!res.ok) {
        console.error("Failed to load threads:", raw);
        return;
      }

      const data: ThreadResponse[] = JSON.parse(raw).map((thread: ThreadResponse) => ({
        ...thread,
        messages: thread.messages.sort(
          (a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
        )
      }));
      setThreads(data);

      // Fetch other users' info
      const otherUserIds = data.map(t =>
        t.receivingUser === userId ? t.sendingUser : t.receivingUser
      );
      for (const id of new Set(otherUserIds)) {
        await fetchUserInfo(id);
      }

      if (!activeThread && data.length > 0) {
        setActiveThread(data[0]);
      }

      return data;
    } catch (error) {
      console.error("Unexpected error fetching threads:", error);
    }
  };

  //Fetch Messages by page for the active thread
  const fetchMessages = async (page: number) => {
    if (!userId || !activeThread) return [];
    const otherId = activeThread.receivingUser === userId ? activeThread.sendingUser: activeThread.receivingUser;
    
    const url = `http://localhost:8000/api/v1/threads/${userId}/and/${otherId}?page=${page}&limit=10`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${keycloak?.token}` }
    });
    if (!res.ok) {
      console.error('Failed to load messages:', await res.text());
      return [];
    }
    const data: ThreadResponse[] = await res.json();
    // backend returns newest→oldest, so reverse to oldest→newest
    return data[0]?.messages.slice().reverse() ?? [];
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserId(); // First, get user_id
    }
  }, [authenticated]);

  useEffect(() => {
    if (userId) {
      fetchThreads(); // Then load threads
    }
  }, [userId]);

  useEffect(() => {
    if (!activeThread) return;
      setMessagePage(1);
      fetchMessages(1).then((msgs) => {
        setMessages(msgs);
        // scroll panel to bottom
        setTimeout(() => {
          messagesContainerRef.current?.scrollTo(
            0,
            messagesContainerRef.current.scrollHeight
          );
        }, 0);
    });
  }, [activeThread]);

  useEffect(() => {
    setTimeout(() => {
      messagesContainerRef.current?.scrollTo(
        0,
        messagesContainerRef.current.scrollHeight
      );
    }, 0);
  }, [messages.length]);

  useEffect(() => {
    if (!activeThread) return;
    const updated = threads.find(t => t.thread_id === activeThread.thread_id);
    if (updated) {
      setActiveThread(updated);
    }
  }, [threads]);

  const handleCreateThread = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser || selectedUser.user_id === userId) return;

    const res = await fetch('http://localhost:8000/api/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak?.token}`
      },
      body: JSON.stringify({
        sendingUser: userId,
        receivingUser: selectedUser.user_id
      })
    });
    if (!res.ok) {
      console.error('Failed to create thread:', await res.text());
      return;
    }
    const created: ThreadResponse = await res.json();
    await fetchThreads();
    setActiveThread(created);
    setSelectedUser(null);
    setRecipientQuery('');
  };

  //send message, then reload page 1 of messages (newest)
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeThread || !newMessageText.trim()) return;

    const res = await fetch('http://localhost:8000/api/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak?.token}`
      },
      body: JSON.stringify({
        thread_id: activeThread.thread_id,
        hasActiveMessage: false,
        text: newMessageText.trim()
      })
    });
    if (!res.ok) {
      console.error('Failed to send message:', await res.text());
      return;
    }

    setNewMessageText('');
    // reload newest messages
    fetchMessages(1).then((msgs) => {
      setMessages(msgs);
      setMessagePage(1);
    });
  };

  return (
    <Base>
      <Box sx={{ flex: 1, p: 2, bgcolor: theme.palette.background.default, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <Box display="flex" flex={1} flexDirection={isSmallScreen ? 'column' : 'row'} overflow="hidden" sx={{ minHeight: 0 }}>
          {/* ================= Thread List & New Conversation ================= */}
          <Box sx={{width: isSmallScreen ? '100%' : '25%', 
                    borderRight: isSmallScreen ? 'none' : `1px solid ${theme.palette.divider}`,
                    borderBottom: isSmallScreen ? `1px solid ${theme.palette.divider}` : 'none',
                    pr: isSmallScreen ? 0 : 1,
                    pb: isSmallScreen ? 2 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
            <Typography variant="h6" gutterBottom>
              Conversations
            </Typography>

            <Box sx={{flex: 1, overflowY: 'auto', mb:2}}>
              <Box component="form" onSubmit={handleCreateThread} sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Autocomplete
                  size="small"
                  value={selectedUser}
                  onChange={(_, val) => setSelectedUser(val)}
                  inputValue={recipientQuery}
                  onInputChange={(_, val) => {
                    setRecipientQuery(val);
                    if (!val) setSelectedUser(null);
                  }}
                  options={userOptions}
                  getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                  loading={loadingUsers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Find user to message"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUsers && <CircularProgress size={16} />}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!selectedUser || selectedUser.user_id === userId}
                >
                  Start Conversation
                </Button>
              </Box>

              <List disablePadding>
                {threads.map((thread) => {
                  const otherUser =
                    thread.receivingUser === userId
                      ? thread.sendingUser
                      : thread.receivingUser;
                  const lastMsg = thread.messages.length
                    ? thread.messages[thread.messages.length - 1].text
                    : '— no messages —';

                  return (
                    <ListItemButton
                      key={thread.thread_id}
                      selected={activeThread?.thread_id === thread.thread_id}
                      onClick={() => setActiveThread(thread)}
                      sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
                    >
                      <ListItemText
                        primary={
                          userMap[otherUser]
                            ? `${userMap[otherUser].firstName} ${userMap[otherUser].lastName}`
                            : `User ${otherUser}`
                        }
                        secondary={lastMsg}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          </Box>

          {/* ================= Message Panel ================= */}
          <Box flex={1} px={2} display="flex" flexDirection="column" sx={{ minHeight: 0 }}>
            {activeThread ? (
              <>
                <Box
                  ref={messagesContainerRef}
                  onScroll={(e: UIEvent<HTMLDivElement>) => {
                    const el = e.currentTarget;
                    if (el.scrollTop === 0 && activeThread) {
                      // load older page
                      const next = messagePage + 1;
                      fetchMessages(next).then((older) => {
                        if (older.length) {
                          setMessages((prev) => [...older, ...prev]);
                          setMessagePage(next);
                          // keep scroll at roughly the same spot
                          setTimeout(() => {
                            el.scrollTop = older.length * 60; /* approx height */
                          }, 0);
                        }
                      });
                    }
                  }}
                  sx={{ flex: 1, overflowY: 'auto', minHeight: 0, maxHeight: '100%', mb: 2 }}
                >
                  {messages.map((msg) => {
                    const isOwn = msg.hasActiveMessage;
                    return (
                      <Box
                        key={msg.message_id}
                        display="flex"
                        justifyContent={isOwn ? 'flex-start' : 'flex-end'}
                        mb={1}
                      >
                        <Box
                          p={1}
                          maxWidth="70%"
                          bgcolor={isOwn ? theme.palette.primary.main : theme.palette.grey[300]}
                          color={isOwn ? '#fff' : '#000'}
                          borderRadius={2}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                          <Typography variant="caption" display="block" textAlign="right">
                            {new Date(msg.timeStamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message…"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                  />
                  <Button variant="contained" type="submit">
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">
                Select or start a conversation.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Base>
  );
}