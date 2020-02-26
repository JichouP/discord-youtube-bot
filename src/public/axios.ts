/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import { DBScheme, ChannelDBScheme, DiscordUser } from '../app';
import { YoutubeChannelsResponse } from '../utils/youtube';

const request = axios.create({ baseURL: location.href });

export const getUsers = async (): Promise<AxiosResponse<DiscordUser[]>> => {
  return request.get('/users');
};
export const getChannel = async () => {
  return request.get<DBScheme[]>('/channel');
};
export const getChannelDetail = async (channelId: string): Promise<AxiosResponse<YoutubeChannelsResponse>> => {
  return request.get(`/channel/detail/${channelId}`);
};
export const postChannelRegist = (channelId: string) => {
  return request.post(`/channel/id/${channelId}`);
};
export const postChannelUser = (channelId: string, userId: string) => {
  return request.post(`/channel/id/${channelId}/user/${userId}`);
};
export const deleteChannel = (channelId: string) => {
  return request.delete(`/channel/${channelId}`);
};
export const deleteChannelRegist = (channelId: string, userId: string) => {
  return request.delete(`/channel/${channelId}/user/${userId}`);
};
export const getChannelDataList = () => {
  return request.get<ChannelDBScheme[]>('/channel/data');
};
