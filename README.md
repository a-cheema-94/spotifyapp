# Spotify Player and Playlist Creator

## Description

A Spotify clone application, that allows users to search for songs, play them and create custom playlists to be added to their own spotify account. Ideal for personal use.

## Features

- OAuth Authorization Code Flow enables users to manage their own Spotify accounts via a Node Js server.
- Refresh tokens are used to recycle access tokens, ensuring secure authentication.
- Search whole Spotify library for tracks.
- Makes use of react-spotify-web-playback library for playback.
- Can add, remove songs to a custom playlist which then can be uploaded to user's Spotify account.

## Tech Stack Used

- **Front End**: React, Typescript, React Bootstrap
- **Back End**: Node, Express

## Installation

### Prerequisites

- Ensure you have the latest versions of Node.js and npm; check with `node -v` and `npm -v`.

### Instructions:

1. Clone repo:

   `git clone https://github.com/spotifyapp-github-url.git`;

2. Navigate to directory:

   `cd spotify-app`

3. Install dependencies:

   `npm install`

4. Set up environment variables in a .env file:

   SPOTIFY_CLIENT_ID = your_spotify_client_id
   SPOTIFY_CLIENT_SECRET = your_spotify_client_secret4

5. In Spotify account app dashboard, make sure redirect uri is setup up to "http://127.0.0.1:5173/auth/callback"

6. Run client development server:

   `npm run dev`

7. Run node server:

   `npm run server`

The app will open at http://localhost:5173 in your web browser and node server will open on http://localhost:5000.

## Takeaways

- Gained experience with the Spotify API and OAuth Authorization code flow.
- Learnt best practices for creating an API in a node express server.
- Developed front end UI skills by creating a smooth user experience on client.
- Integrated mock service worker into tests to accurately simulate network requests.
- Understood and explored various ways of storing and transferring data on client / server side, e.g. using cookies to validate user on server.

## Acknowledgments

- Spotify
- Spotify API
- react-spotify-web-playback
- react-bootstrap
