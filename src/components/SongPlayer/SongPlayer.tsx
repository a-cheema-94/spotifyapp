import { FC, useEffect, useState } from "react"
import  SpotifyPlayer  from "react-spotify-web-playback"
import { TrackType } from "../../types/types"

const SongPlayer: FC<{ accessToken: string, trackUri: string | null }> = ({ accessToken, trackUri }) => {
  const [playTrack, setPlayTrack] = useState(false);

  useEffect(() => setPlayTrack(true), [trackUri]);

  return (
    <>
      {/* <h1>song player</h1> */}
      <SpotifyPlayer 
        token={accessToken}
        uris={trackUri ? [trackUri] : []}
        // if we selected a valid spotify track which will pass our uri inside this component then we set uris to an array with the uri inside otherwise we give an empty array so no tracks are played.
        play={playTrack}
        callback={(state) => !state.isPlaying && setPlayTrack(false)}

      />
    </>
  )
}

export default SongPlayer