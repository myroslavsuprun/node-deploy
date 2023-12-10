const express = require("express");
const { createClient } = require("redis");
const bodyParser = require("body-parser");

main();

async function main() {
  const app = express();
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  await client.connect();

  app.use(bodyParser.json({ type: "application/json" }));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.post("/set", async (req, res) => {
    const body = req.body;
    await client.set(body.key, body.value);

    res.send("OK");
  });

  app.get("/get", async (req, res) => {
    const { key } = req.query;
    const value = await client.get(key);

    res.send(value);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
