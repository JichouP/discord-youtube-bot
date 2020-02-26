import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  open: boolean;
  channelName: string;
  handleClose: () => void;
  handleRegist: () => void;
}

export default function FormConfirmDialog(props: Props) {
  const { open, handleClose, handleRegist, channelName } = props;

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{channelName}を追加しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            キャンセル
          </Button>
          <Button onClick={handleRegist} color='primary'>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
