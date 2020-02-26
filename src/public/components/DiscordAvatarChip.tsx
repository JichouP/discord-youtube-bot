import React from 'react';
import { Chip, Avatar } from '@material-ui/core';

interface Props {
  img: string;
  name: string;
  handleDelete: () => void;
}

const DiscordAvatarChip = (props: Props): JSX.Element => {
  return <Chip avatar={<Avatar alt='Icon' src={props.img} />} label={props.name} onDelete={props.handleDelete} />;
};

export default DiscordAvatarChip;
