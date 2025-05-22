import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import { generateRandomString } from "./helperFunctions.js";
import cookieParser from "cookie-parser";

global.access_token = "";
global.refresh_token = "";
global.expires_in = "";


dotenv.config();
export const port = process.env.PORT || 4444;
// export const host = "127.0.0.1";

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://127.0.0.1:5173/auth/callback";

export const app = express();

// allow cookies in requests from this origin
const allowedOrigins = [
  "http://127.0.0.1:5173", // dev mode
  "VERCEL_URL"
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  credentials: true,
  maxAge: 86400
}

app.use(cors(corsOptions));


app.use(cookieParser());
app.use(express.json()); // parses JSON data from post requests

// config for vercel


app.get("/auth/login", async (req, res) => {
  const state = generateRandomString(20);
  console.log("INITIAL STATE:", state);

  // put initial state in a cookie
  res.cookie("state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 2,
  });

  const scope =
    "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-modify-public playlist-modify-private";

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    state,
    redirect_uri,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
  console.log("successfully logged in");
});

app.post("/auth/token", async (req, res) => {
  const code = req.body.code;
  const state = req.body.state;
  console.log("STATE RETURNED FROM SPOTIFY:", state);

  const storedCookieState = req.cookies.state;

  // retrieve cookie from request
  console.log("STORED COOKIE STATE:", storedCookieState);

  // added validation, comparison of state parameters.
  if (!state || state !== storedCookieState) {
    return res.status(400).send("State Parameter Invalid");
  }

  const options = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: {
      grant_type: "authorization_code",
      code: code,
      redirect_uri,
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(options)
    .then((data) => {
      access_token = data.data.access_token;
      refresh_token = data.data.refresh_token;
      expires_in = data.data.expires_in;
      console.log("accessToken: ", access_token);
      console.log("refreshToken: ", refresh_token);
      console.log("expiresIn: ", expires_in);
      res.json({
        access_token,
        refresh_token,
        expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
      console.log(err);
    });
});

app.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  const options = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(options)
    .then((data) => {
      access_token = data.data.access_token;
      expires_in = data.data.expires_in;
      console.log("accessToken: ", access_token);
      console.log("expiresIn: ", expires_in);
      res.json({
        access_token,
        expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
      console.log(err);
    });
});

app.post("/search", (req, res) => {
  const { query, accessToken } = req.body;

  axios({
    method: "get",
    url: `https://api.spotify.com/v1/search?q=${query}&type=track`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((data) => {
      console.log("successful search");
      res.send(data.data.tracks.items);
    })
    .catch((err) => {
      console.log(err);
      console.log("unsuccessful search");
    });
});

app.post("/playlist", (req, res) => {
  const { playlistName, songsToAdd, accessToken } = req.body;
  console.log(playlistName);
  console.log(songsToAdd);

  // Chained calls
  // functions
  const getUserId = () => {
    return new Promise((resolve, reject) => {
      // request.then(res => { return res.userId })
      axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          const userId = res.data.id;
          return userId;
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const createPlaylist = (userId) => {
    return new Promise((resolve, reject) => {
      // request.then(res => { return res.playlistId })
      axios({
        method: "post",
        url: `https://api.spotify.com/v1/users/${userId}/playlists`,
        data: {
          name: playlistName,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          const playlistId = res.data.id;
          return playlistId;
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const addTracksToPlaylist = (playlistId) => {
    return new Promise((resolve, reject) => {
      // request.then(res => { return res.data.snapshot_id })
      axios({
        method: "post",
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        data: {
          uris: songsToAdd,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          console.log(
            "created new spotify playlist and added tracks successfully"
          );
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  getUserId()
    .then((userID) => {
      return createPlaylist(userID);
    })
    .then((playlistID) => {
      return addTracksToPlaylist(playlistID);
    })
    .catch((err) => {
      console.log(err);
      console.log("unsuccessfully added tracks");
    });

  res.send("confirmation message");
});

if(process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Listening at ${port}`);
  });
}



export default app;