import packageJSON from "../../../package.json";
import express, { Application } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { AxiosError, AxiosResponse } from "axios";
import bodyParser from "body-parser";
import { qBittorrentClient, TorrentAddParameters } from '@robertklep/qbittorrent';
import MyAnonamouseClient from "../utils/myanonamouseClient";

const app: Application = express();

var jsonParser = bodyParser.json();

app.use(express.json({ limit: "20mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

let mamId = "";

// Serve a successful response. For use with wait-on
app.get("/api/v1/health", (req, res) => {
  res.send({ status: "ok" });
});

app.get(`/api/v1/version`, (req: Request, res: Response) => {
  const respObj: RespExampleType = {
    id: 1,
    version: packageJSON.version,
    envVal: process.env.ENV_VALUE as string, // sample server-side env value
  };
  res.send(respObj);
});

app.post('/api/v1/mamid', jsonParser, (req, res) => {
  mamId = req.body.mamid;

  console.log(`mamid set`);

  res.status(204).send();
});

app.get('/api/v1/mamid', (req, res) => {
  res.send({ mamid: mamId });
});

app.post('/api/v1/search', jsonParser, async (req, res) => {
  const client = new MyAnonamouseClient(mamId);

  await client.search(req.body.search)
    .then((response: AxiosResponse) => {
      res.status(response.status).send(response.data)
    }).catch((response: AxiosError) => {
      console.log('search request failed')
      console.log(response)
      if (response.response) {
        res.status(response.response.status).send(response.response.data)
      } else {
        res.status(500).send('Unable to connect to myanonamouse')
      }
    });
});

app.post('/api/v1/download', jsonParser, async (req, res) => {
  let client;
  let response;

  try {
    client = new qBittorrentClient(
      process.env.QBITTORRENT_URL as string,
      process.env.QBITTORRENT_USERNAME as string,
      process.env.QBITTORRENT_PASSWORD as string
    );
  } catch (err) {
    console.log('failed to create qbittorrent client')
    console.log(err)
    res.status(500).send('failed to create qbittorrent client')

    return
  }

  //const addPaused = process.env.QBITTORRENT_ADD_PAUSED as string == "true";

  try {
    response = await client.torrents.add(<TorrentAddParameters>{
      urls: 'https://www.myanonamouse.net/tor/download.php/' + req.body.dl,
      category: 'books',
      seedingTimeLimit: 43200,
      paused: true
    });
  } catch (err) {
    console.log('failed to add torrent')
    console.log(err)
    res.status(500).send('failed to add torrent')

    return
  }

  if (response == 'Ok.') {
    res.status(204).send();
  } else {
    res.status(400).send(response);
  }
});

app.use(express.static("./.local/vite/dist"));

export default app;
