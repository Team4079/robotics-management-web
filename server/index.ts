import express, { Express } from "express";
import "./setupProxy";

const app: Express = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const SERVER_PORT: number = process.env.PORT as unknown as number || 3000;

app.listen(SERVER_PORT, () => {
  console.log(`Server is running at http://localhost:${SERVER_PORT}`);
});