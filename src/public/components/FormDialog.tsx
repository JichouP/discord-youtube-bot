import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleRegist: (channelId: string) => void;
}

export default function FormDialog(props: Props) {
  const { open, handleClose } = props;

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>チャンネルを追加する</DialogTitle>
        <DialogContent>
          <DialogContentText>YouTubeチャンネルのIDを入力してください</DialogContentText>
          <TextField autoFocus margin='dense' id='channel_id' label='チャンネルID' type='text' fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            キャンセル
          </Button>
          <Button
            onClick={() => {
              props.handleRegist((document.getElementById('channel_id') as HTMLInputElement).value);
            }}
            color='primary'
          >
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
