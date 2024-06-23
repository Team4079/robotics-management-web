import express, { Express } from "express";
import { APP_HOSTNAME, SERVER_PORT } from "./modules/env";
import "./setupProxy";

const app: Express = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running at http://${APP_HOSTNAME}:${SERVER_PORT}`);
});