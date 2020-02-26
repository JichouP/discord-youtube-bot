/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { CssBaseline, makeStyles, createStyles, Box, Container } from '@material-ui/core';
import TopBar from './components/TopBar';
import FormDialog from './components/FormDialog';
import {
  getChannel,
  getChannelDetail,
  getUsers,
  postChannelRegist,
  postChannelUser,
  deleteChannel,
  deleteChannelRegist,
  getChannelDataList,
} from './axios';
import ChannelCard from './components/ChannelCard';
import FormConfirmDialog from './components/FormConfirmDialog';
import { DBScheme, ChannelDBScheme, DiscordUser } from '../app';
import AddUserDialog from './components/AddUserDialog';
import DeleteUserDialog from './components/DeleteUserDialog';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    contents: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: theme.spacing(10),
    },
  })
);

interface RegistedChannel {
  channelId: string;
  channelName: string;
  users: DiscordUser[];
  img: string;
}

let channelDataList: ChannelDBScheme[] = [];
let discordUserList: DiscordUser[] = [];

const App = () => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const classes = useStyles();

  const [currentChannelId, setCurrentChannelId] = useState('');
  const [currentChannelName, setCurrentChannelName] = useState('');

  const [registedChannelList, setRegistedChannelList] = useState<RegistedChannel[]>([]);

  const [isOpenFormDialog, setIsOpenFormDialog] = useState(false);
  const [isOpenFormConfirmDialog, setIsOpenFormConfirmDialog] = useState(false);
  const [isOpenAddUserDialog, setIsOpenAddUserDialog] = useState(false);
  const [isOpenDeleteUserDialog, setIsOpenDeleteUserDialog] = useState(false);

  useEffect(() => {
    getUsers()
      .then(res => {
        discordUserList = res.data;
      })
      .then(() => {
        fetchChannelDataList().then(() => {
          fetchRegistedChannelList();
        });
      })
      .catch(err => console.log(err));
  }, []);

  const fetchChannelDataList = (): Promise<ChannelDBScheme[]> => {
    return new Promise((resolve, reject) => {
      getChannelDataList()
        .then(res => {
          channelDataList = res.data;
          resolve(res.data);
        })
        .catch(err => reject(err));
    });
  };
  const fetchRegistedChannelList = () => {
    getChannel()
      .then(res => {
        const list: RegistedChannel[] = [];
        const data = res.data;
        const channelList = [...new Set(data.map(v => v.channelId))];
        channelDataList.length &&
          channelList.forEach(channelId => {
            const channel = channelDataList.filter(v => v.channelId === channelId)[0];
            list.push({
              channelId,
              channelName: channel.channelName,
              users: data
                .filter(v => v.channelId === channelId && v.discordUserId)
                .map(v => {
                  const user = discordUserList.find(i => i.id === v.discordUserId);
                  return { id: user?.id, displayName: user?.displayName, avatarURL: user?.avatarURL } as DiscordUser;
                }),
              img: `${location.href}img/${channelId}.png`,
            });
          });
        setRegistedChannelList(list);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const fetchAll = () => {
    fetchChannelDataList()
      .then(() => {
        fetchRegistedChannelList();
      })
      .catch(err => console.log(err));
  };

  const handleClickOpenFormDialog = () => {
    setIsOpenFormDialog(true);
  };
  const handleCloseFormDialog = () => {
    setIsOpenFormDialog(false);
  };
  const handleRegistFormDialog = (channelId: string) => {
    if (channelId.length === 0) {
      return;
    }
    getChannelDetail(channelId)
      .then(res => {
        const item = res.data.items[0];
        if (!item) {
          return;
        }
        setIsOpenFormDialog(false);
        setCurrentChannelId(item.id);
        setCurrentChannelName(item.snippet.title);
        setIsOpenFormConfirmDialog(true);
      })
      .catch(err => console.log(err));
  };
  const handleRegistFormConfirmDialog = () => {
    postChannelRegist(currentChannelId)
      .then(() => {
        fetchAll();
      })
      .catch(err => console.log(err));
    setIsOpenFormConfirmDialog(false);
  };
  const handleCloseFormConfirmDialog = () => {
    setIsOpenFormConfirmDialog(false);
  };
  const handleClickAddUserIcon = (channelId: string) => {
    setCurrentChannelId(channelId);
    setIsOpenAddUserDialog(true);
  };
  const handleCloseAddUser = () => {
    setIsOpenAddUserDialog(false);
  };
  const handleAddUser = (channelId: string, discordUserId: string) => {
    postChannelUser(channelId, discordUserId).then(() => {
      fetchAll();
    });
    setIsOpenAddUserDialog(false);
  };
  const handleDeleteChannel = (channelId: string) => {
    setIsOpenDeleteUserDialog(true);
    setCurrentChannelId(channelId);
    setCurrentChannelName(channelDataList.find(v => v.channelId === channelId)!.channelName);
  };
  const handleConfirmDeleteChannel = () => {
    deleteChannel(currentChannelId)
      .then(() => {
        fetchAll();
      })
      .catch(err => console.log(err));
    setIsOpenDeleteUserDialog(false);
  };

  return (
    <div>
      <CssBaseline></CssBaseline>
      <FormDialog
        open={isOpenFormDialog}
        handleClose={handleCloseFormDialog}
        handleRegist={handleRegistFormDialog}
      ></FormDialog>
      <FormConfirmDialog
        open={isOpenFormConfirmDialog}
        channelName={currentChannelName}
        handleClose={handleCloseFormConfirmDialog}
        handleRegist={handleRegistFormConfirmDialog}
      ></FormConfirmDialog>
      <AddUserDialog
        open={isOpenAddUserDialog}
        users={discordUserList}
        channelId={currentChannelId}
        handleAddUser={handleAddUser}
        handleClose={handleCloseAddUser}
      ></AddUserDialog>
      <DeleteUserDialog
        open={isOpenDeleteUserDialog}
        channelName={currentChannelName}
        handleClose={() => {
          setIsOpenDeleteUserDialog(false);
        }}
        handleRegist={handleConfirmDeleteChannel}
      ></DeleteUserDialog>
      <div className={classes.root}>
        <TopBar onClickAdd={handleClickOpenFormDialog} onClickRefresh={fetchAll}></TopBar>
      </div>
      <Container maxWidth='lg'>
        <Box className={classes.contents}>
          {registedChannelList.map(v => (
            <ChannelCard
              key={v.channelName}
              channelId={v.channelId}
              title={v.channelName}
              img={v.img}
              users={v.users}
              onClickAddUserIcon={() => {
                handleClickAddUserIcon(v.channelId);
              }}
              handleDelete={() => {
                handleDeleteChannel(v.channelId);
              }}
              handleDeleteUser={(userId: string) => {
                deleteChannelRegist(v.channelId, userId)
                  .then(() => {
                    fetchAll();
                  })
                  .catch(err => console.log(err));
              }}
            ></ChannelCard>
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default App;
