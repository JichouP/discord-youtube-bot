import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, createStyles, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    refreshButton: {
      marginRight: theme.spacing(2),
    },
  })
);

interface Props {
  onClickRefresh: () => void;
  onClickAdd: () => void;
}

const TopBar = (props: Props) => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Discord BOT 管理パネル
        </Typography>
        <IconButton
          edge='start'
          className={classes.refreshButton}
          color='inherit'
          aria-label='menu'
          onClick={props.onClickAdd}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          edge='start'
          className={classes.refreshButton}
          color='inherit'
          aria-label='menu'
          onClick={props.onClickRefresh}
        >
          <RefreshIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
