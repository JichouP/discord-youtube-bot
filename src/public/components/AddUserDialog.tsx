/* eslint-disable no-unused-vars */
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import { DiscordUser } from '../../app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface Props {
  open: boolean;
  users: DiscordUser[];
  channelId: string;
  handleClose: () => void;
  handleAddUser: (channelId: string, discordUserId: string) => void;
}

export default function AddUserDialog(props: Props) {
  const { open, handleClose, users, handleAddUser, channelId } = props;
  const classes = useStyles();

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <List dense className={classes.root}>
          {users.map(value => {
            return (
              <ListItem
                key={value.id}
                button
                onClick={() => {
                  handleAddUser(channelId, value.id);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={value.displayName} src={value.avatarURL} />
                </ListItemAvatar>
                <ListItemText primary={value.displayName} />
              </ListItem>
            );
          })}
        </List>
      </Dialog>
    </div>
  );
}
