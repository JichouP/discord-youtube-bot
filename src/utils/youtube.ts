/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = axios.create({ baseURL: 'https://www.googleapis.com/youtube/v3' });

export const getChannelsList = async (channelId: string): Promise<AxiosResponse<YoutubeChannelsResponse>> => {
  return youtube.get(
    `/channels?part=snippet&id=${channelId}&key=${API_KEY}&maxResults=1&fields=items/snippet(title,thumbnails/medium/url)`
  );
};

export interface YoutubeChannelsResponse {
  // kind: string;
  // etag: string;
  // pageInfo: {
  //   totalResults: number;
  //   resultsPerPage: number;
  // };
  items: {
    // kind: string;
    // etag: string;
    // id: string;
    snippet: {
      title: string;
      // description: string;
      // publishedAt: string;
      thumbnails: {
        // default: {
        //   url: string;
        //   width: number;
        //   height: number;
        // };
        medium: {
          url: string;
          // width: number;
          // height: number;
        };
        // high: {
        //   url: string;
        //   width: number;
        //   height: number;
        // };
      };
      // localized: {
      //   title: string;
      //   description: string;
      // };
      // country: string;
    };
  }[];
}

export const getSearchList = async (channelId: string): Promise<AxiosResponse<YoutubeSearchResponse>> => {
  return youtube.get(
    `/search?part=snippet&channelId=${channelId}&order=date&key=${API_KEY}&maxResults=2&fields=items(id/videoId,snippet(title,liveBroadcastContent))`
  );
};

export interface YoutubeSearchResponse {
  // kind: string;
  // etag: string;
  // nextPageToken: string;
  // regionCode: string;
  // pageInfo: {
  //   totalResults: number;
  //   resultsPerPage: number;
  // };
  items: {
    // kind: string;
    // etag: string;
    id: {
      // kind: string;
      videoId: string;
    };
    snippet: {
      // publishedAt: string;
      // channelId: string;
      title: string;
      // description: string;
      // thumbnails: {
      //   default: {
      //     url: string;
      //     width: number;
      //     height: number;
      //   };
      //   medium: {
      //     url: string;
      //     width: number;
      //     height: number;
      //   };
      //   high: {
      //     url: string;
      //     width: number;
      //     height: number;
      //   };
      // };
      // channelTitle: string;
      liveBroadcastContent: 'live' | 'upcoming' | 'none';
    };
  }[];
}

export const getVideosList = async (videoId: string): Promise<AxiosResponse<YoutubeVideosResponse>> => {
  return youtube.get(
    `/videos?part=liveStreamingDetails&id=${videoId}&order=date&key=${API_KEY}&maxResults=1&fields=items/liveStreamingDetails/scheduledStartTime`
  );
};

export interface YoutubeVideosResponse {
  // kind: string;
  // etag: string;
  // pageInfo: {
  //   totalResults: number;
  //   resultsPerPage: number;
  // };
  items: {
    // kind: string;
    // etag: string;
    // id: string;
    liveStreamingDetails: {
      // actualStartTime?: string;
      scheduledStartTime: string;
      // actualEndTime?: string;
      // concurrentViewers?: string;
      // activeLiveChatId?: string;
    };
  }[];
}
