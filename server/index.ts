import express, { Express } from "express";
import { APP_HOSTNAME, SERVER_PORT, CLIENT_ID } from "./modules/env";
import { OAuth2Client } from "google-auth-library";
import "./setupProxy";

const app: Express = express();
const client: OAuth2Client = new OAuth2Client();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

async function verify(token: string): Promise<string | undefined> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    return ticket.getPayload()?.sub;
  } catch (error: unknown) {
    console.error("Error:", error);
  }
}

app.post("/login", async (req, res) => {
  const token: string = req.body.token;

  const userId = await verify(token);

  if (userId) {
    res.json({ token: userId });
  } else {
    res.json({ error: "Invalid token" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(SERVER_PORT, () => {
  console.log(`Server is running at http://${APP_HOSTNAME}:${SERVER_PORT}`);
});