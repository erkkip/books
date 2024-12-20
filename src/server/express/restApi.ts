import packageJSON from "../../../package.json";
import express, { Application } from "express";
import cors from "cors";
import { Request, Response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { qBittorrentClient, TorrentAddParameters } from '@robertklep/qbittorrent';

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

  res.status(204).send();
});

app.get('/api/v1/mamid', (req, res) => {
  res.send({ mamid: mamId });
});

app.post('/api/v1/search', jsonParser, async (req, res) => {
  const client = axios.create({
      baseURL: 'https://www.myanonamouse.net',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': 'uid=217012; mam_id=' + mamId,
      },
  });

  const {data} = await client.post('/tor/js/loadSearchJSONbasic.php', {
      "tor": {
          "text": req.body.search,
          "srchIn": {
              "title": "true",
              "author": "true"
          },
          "main_cat": [14],
          "searchType": "active"
      },
      "thumbnail": "true",
      "dlLink": "true"
  });

  res.send(data);
});

app.post('/api/v1/download', jsonParser, async (req, res) => {
  const client = new qBittorrentClient(
    process.env.QBITTORRENT_URL as string,
    process.env.QBITTORRENT_USERNAME as string,
    process.env.QBITTORRENT_PASSWORD as string
  );

  const addPaused = process.env.QBITTORRENT_ADD_PAUSED as string == "true";

  const response = await client.torrents.add(<TorrentAddParameters>{
    urls: 'https://www.myanonamouse.net/tor/download.php/' + req.body.dl,
    category: 'books',
    seedingTimeLimit: 43200,
    paused: addPaused
  });

  if (response == 'Ok.') {
    res.status(204).send();
  } else {
    res.status(400).send(response);
  }
});

app.use(express.static("./.local/vite/dist"));

export default app;
