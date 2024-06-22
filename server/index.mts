import express, { Express } from "express";

const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const SERVER_PORT: number = process.env.PORT as unknown as number || 3000;

app.listen(SERVER_PORT, () => {
  console.log(`Server is running at http://localhost:${SERVER_PORT}`);
});