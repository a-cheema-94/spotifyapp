import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios';
import cors from 'cors';

global.access_token = '';
global.refresh_token = '';
global.expires_in = '';

const port = 5000

dotenv.config();

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

const app = express();
app.use(cors());
app.use(express.json())

app.get('/auth/login', (req, res) => {

  const scope = "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-modify-public playlist-modify-private"
  
  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:5173/auth/callback",
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  console.log('successfully logged in');
});

app.post('/auth/token', (req, res) => {

  const code = req.body.code;
  
  const options = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:5173/auth/callback'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
  }

  axios(options)
    .then(data => {
        
        access_token = data.data.access_token;
        refresh_token = data.data.refresh_token;
        expires_in = data.data.expires_in;
        console.log('accessToken: ', access_token);
        console.log('refreshToken: ', refresh_token);
        console.log('expiresIn: ', expires_in);
        res.json({ 
          access_token,
          refresh_token,
          expires_in,
         })
      })
      .catch(err => {
          res.sendStatus(400)
          console.log(err);
        })
})

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  const options = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
  }

  axios(options).then(data => {
    console.log(data.data);
    access_token = data.data.access_token;
    expires_in = data.data.expires_in;
    console.log('accessToken: ', access_token);
    console.log('expiresIn: ', expires_in);
    res.json({ 
      access_token,
      expires_in,
     })
  })
  .catch(err => {
      res.sendStatus(400)
      console.log(err);
    })
})

app.post('/search', (req, res) => {
  const { query, accessToken } = req.body;

  axios({
    method: 'get',
    url: `https://api.spotify.com/v1/search?q=${query}&type=track`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  .then(data => {
    console.log('successful search')
    res.send(data.data.tracks.items)
  })
  .catch(err => {
    console.log(err)
    console.log('unsuccessful search')
  })
})

app.post('/playlist', (req, res) => {
  const { playlistName, songsToAdd, accessToken } = req.body;
  console.log(playlistName)
  console.log(songsToAdd)
  
  // Chained calls
  // functions
  const getUserId = () => {
    return new Promise((resolve, reject) => {
      // request.then(res => { return res.userId })
      axios({
        method: 'get',
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => {
        const userId = res.data.id;
        return userId;
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    });
  }
  const createPlaylist = (userId) => {
    return new Promise((resolve, reject) => {
      // request.then(res => { return res.playlistId })
      axios({
        method: 'post',
        url: `https://api.spotify.com/v1/users/${userId}/playlists`,
        data: {
          "name": playlistName
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => {
        const playlistId = res.data.id;
        return playlistId;
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    });
  }
  const addTracksToPlaylist = (playlistId) => {
    return new Promise((resolve, reject) => {
      // request.then(res => { return res.data.snapshot_id })
      axios({
        method: 'post',
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        data: {
          "uris": songsToAdd
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => {
        console.log(res)
        console.log('created new spotify playlist and added tracks successfully')
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    });
  }

  getUserId().then(userID => {
    return createPlaylist(userID);
  }).then(playlistID => {
    return addTracksToPlaylist(playlistID)
  }).catch(err => {
    console.log(err)
    console.log('unsuccessfully added tracks')
  })

  res.send('confirmation message')
})


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})