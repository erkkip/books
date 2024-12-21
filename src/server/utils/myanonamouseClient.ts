import axios from "axios";

export default class MyAnonamouseClient {
  #client

  constructor (mamId: string) {
    this.#client = axios.create({
      headers: {
          'Cookie': 'uid=217012; mam_id=' + (mamId ? mamId : process.env.MAM_ID as string),
      },
    });
  }

  async search(search: string) {
    return this.#client.post('https://www.myanonamouse.net/tor/js/loadSearchJSONbasic.php', {
      "tor": {
          "text": search,
          "srchIn": {
              "title": "true",
              "author": "true"
          },
          "main_cat": [14],
          "searchType": "active"
      },
      "thumbnail": "true",
      "dlLink": "true"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  }
};