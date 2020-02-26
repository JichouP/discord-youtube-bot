/* eslint-disable no-unused-vars */
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DiscordAvatarChip from './DiscordAvatarChip';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginTop: theme.spacing(1),
      height: 100,
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      minWidth: 100,
    },
    users: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    typography: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'inline',
    },
    button: {
      marginLeft: theme.spacing(1),
      color: theme.palette.grey[600],
    },
  })
);

interface Props {
  channelId: string;
  title: string;
  img: string;
  users: { avatarURL: string; displayName: string; id: string }[];
  onClickAddUserIcon: () => void;
  handleDelete: (id: string) => void;
  handleDeleteUser: (userId: string) => void;
}

const ChannelCard = (props: Props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.cover} image={props.img} title='Channel Avatar' />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component='h5' variant='h5' className={classes.typography}>
            {props.title}
          </Typography>
        </CardContent>
        <div className={classes.users}>
          <IconButton
            edge='start'
            className={classes.button}
            color='inherit'
            aria-label='menu'
            onClick={() => {
              props.handleDelete(props.channelId);
            }}
            size='small'
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            edge='start'
            className={classes.button}
            color='inherit'
            aria-label='menu'
            onClick={props.onClickAddUserIcon}
            size='small'
          >
            <AddIcon />
          </IconButton>
          {props.users.map(v => (
            <DiscordAvatarChip
              key={v.id}
              name={v.displayName}
              img={v.avatarURL}
              handleDelete={() => {
                props.handleDeleteUser(v.id);
              }}
            ></DiscordAvatarChip>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChannelCard;
