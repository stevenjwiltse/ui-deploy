import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface Message {
  id: number;
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {messages.map((message) => (
        <Box
          key={message.id}
          p={2}
          borderRadius={2}
          bgcolor={theme.palette.secondary.main}
          maxWidth="75%"
        >
          <Typography variant="body1" color="text.primary">
            {message.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MessageList;