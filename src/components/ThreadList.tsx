import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from '@mui/material';

interface Thread {
  id: number;
  name: string;
}

interface ThreadListProps {
  threads: Thread[];
  activeThread: Thread | null;
  onThreadClick: (thread: Thread) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, activeThread, onThreadClick }) => {
  const theme = useTheme();

  return (
    <List disablePadding>
      {threads.map((thread) => (
        <ListItemButton
          key={thread.id}
          selected={activeThread?.id === thread.id}
          onClick={() => onThreadClick(thread)}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            '&.Mui-selected': {
              backgroundColor: theme.palette.secondary.main,
              fontWeight: 'bold',
            },
          }}
        >
          <ListItemText primary={thread.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default ThreadList;