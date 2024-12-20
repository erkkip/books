export default class Client {
  async search(search: string) {
    const res = await fetch('api/v1/search', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: search
      })
    });

    const data = await res.json();

    return data;
  }

  async setMamid(mamid: string) {
    await fetch('api/v1/mamid', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mamid: mamid
      })
    });
  }

  async download(dl: string) {
    return await fetch('api/v1/download', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dl: dl
      })
    });
  }
};