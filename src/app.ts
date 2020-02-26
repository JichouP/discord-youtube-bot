import express from 'express';
import path from 'path';
import Datastore from 'nedb';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { getChannelsList, getSearchList, getVideosList } from './utils/youtube';
import download from './utils/download';

dotenv.config();

export interface DBScheme {
  channelId: string;
  discordUserId: string;
}
export interface ChannelDBScheme {
  channelId: string;
  channelName: string;
}
export interface DiscordUser {
  id: string;
  displayName: string;
  avatarURL: string;
}
interface StreamingDBScheme {
  videoId: string;
}

const app = express();

const init = async (): Promise<void> => {
  // .env
  if (!process.env.PORT || !process.env.DISCORD_CHANNEL || !process.env.DISCORD_TOKEN || !process.env.YOUTUBE_API_KEY) {
    console.log('Create a .env file');
    return;
  }
  const env = {
    port: process.env.PORT,
    discord: {
      channel: process.env.DISCORD_CHANNEL,
      token: process.env.DISCORD_TOKEN,
    },
  };

  // DB
  const db = new Datastore({ filename: path.resolve(__dirname, 'datafile.db'), autoload: true });
  const streamingDB = new Datastore({ filename: path.resolve(__dirname, 'streaming.db'), autoload: true });
  const channelDB = new Datastore({ filename: path.resolve(__dirname, 'channel.db'), autoload: true });

  // discord
  const client = new Discord.Client();
  await client.login(env.discord.token).catch(err => {
    console.log(err);
  });
  const _ch = client.channels.get(env.discord.channel);
  if (_ch === undefined) {
    console.log('Invalid Channel ID');
    return;
  } else if (_ch.type !== 'text') {
    console.log('Invalid Channel ID');
    return;
  }
  const channel = _ch as Discord.TextChannel;

  //express

  const updateChannelDB = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const channelId = req.params.channelId;
    getChannelsList(channelId).then(youtubeChannels => {
      const item = youtubeChannels.data.items[0];
      download(item.snippet.thumbnails.medium.url, path.resolve(__dirname, 'public', 'img', item.id + '.png'));
      channelDB.update(
        { channelId: item.id } as ChannelDBScheme,
        {
          channelId: item.id,
          channelName: item.snippet.title,
        } as ChannelDBScheme,
        { upsert: true }
      );
      next();
    });
  };

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.setHeader('access-control-allow-origin', '*');
    next();
  });
  app.use('/', express.static(path.resolve(__dirname, 'public')));

  app.get('/users', (req, res): void => {
    res.send(
      channel.members.map(v => ({
        id: v.id,
        displayName: v.displayName,
        avatarURL: v.user.avatarURL,
      })) as DiscordUser[]
    );
  });
  app.get('/channel', (req: express.Request, res: express.Response): void => {
    db.find({}, (err: any, docs: DBScheme[]) => {
      if (err) {
        console.log('GET /channels', err);
        return;
      }
      res.status(200).send(docs);
    });
  });
  app.get('/channel/detail/:id', (req, res): void => {
    getChannelsList(req.params.id)
      .then(v => {
        res.send(v.data);
      })
      .catch(err => console.log(err));
  });
  app.post('/channel/id/:channelId', updateChannelDB, (req: express.Request, res: express.Response): void => {
    db.update(
      { channelId: req.params.channelId, discordUserId: '' } as DBScheme,
      { channelId: req.params.channelId, discordUserId: '' } as DBScheme,
      { upsert: true },
      err => {
        if (err) {
          console.log('POST /channels', err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(204);
      }
    );
  });
  app.post(
    '/channel/id/:channelId/user/:userId',
    updateChannelDB,
    (req: express.Request, res: express.Response): void => {
      db.update(
        { channelId: req.params.channelId, discordUserId: req.params.userId } as DBScheme,
        { channelId: req.params.channelId, discordUserId: req.params.userId } as DBScheme,
        { upsert: true },
        err => {
          if (err) {
            console.log('POST /channels', err);
            res.sendStatus(500);
            return;
          }
          res.sendStatus(204);
        }
      );
    }
  );
  app.delete('/channel/:channelId/user/:userId', (req: express.Request, res: express.Response): void => {
    db.remove({ channelId: req.params.channelId, discordUserId: req.params.userId } as DBScheme, err => {
      if (err) {
        console.log('DELETE /channels', err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(201);
    });
  });
  app.delete('/channel/:channelId', (req: express.Request, res: express.Response): void => {
    db.remove({ channelId: req.params.channelId } as DBScheme, err => {
      if (err) {
        console.log('DELETE /channels', err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(201);
    });
  });
  app.get('/channel/data', (req: express.Request, res: express.Response): void => {
    channelDB.find({}, (err: Error, docs: ChannelDBScheme[]) => {
      if (err) {
        console.log(err);
      }
      res.send(docs);
    });
  });

  app.use((req, res, next) => {
    res.sendStatus(500);
    next();
  });

  // cron
  cron.schedule('0,15,30,45 * * * *', () => {
    db.find({}, (err: any, docs: DBScheme[]) => {
      if (err) {
        console.log(err);
        return;
      }
      const channelList = [...new Set(docs.map(v => v.channelId))];
      channelList.forEach(channelId => {
        getSearchList(channelId)
          .then(searchRes => {
            searchRes.data.items.forEach(searchItem => {
              if (searchItem.snippet.liveBroadcastContent !== 'upcoming') {
                return;
              }
              streamingDB.find(
                { videoId: searchItem.id.videoId } as StreamingDBScheme,
                (err: Error, streamingDocs: StreamingDBScheme[]) => {
                  if (err) {
                    console.log(err);
                  }
                  if (streamingDocs.length) {
                    return;
                  }
                  const videoId = searchItem.id.videoId;
                  streamingDB.insert({ videoId } as StreamingDBScheme);
                  getVideosList(videoId)
                    .then(videosRes => {
                      const { scheduledStartTime } = videosRes.data.items[0].liveStreamingDetails;
                      const usersString: string = docs.length
                        ? docs
                            .filter(doc => doc.channelId === channelId && doc.discordUserId)
                            .map(doc => `<@${doc.discordUserId}>`)
                            .join(' ') + '\n'
                        : '';
                      channel.sendMessage(
                        `${usersString}${searchItem.snippet.title}\n${new Date(scheduledStartTime).toLocaleString(
                          'ja-JP',
                          {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          }
                        )}\nhttps://www.youtube.com/watch?v=${videoId}`
                      );
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              );
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  });

  app.listen(3000, () => {
    console.log('listening on 3000');
  });
};

init();
