import { FC, useEffect, useState } from "react"
import  SpotifyPlayer  from "react-spotify-web-playback"
import { TrackType } from "../../types/types"

const SongPlayer: FC<{ accessToken: string, trackUri: string | null }> = ({ accessToken, trackUri }) => {
  const [playTrack, setPlayTrack] = useState(false);

  useEffect(() => setPlayTrack(true), [trackUri]);

  return (
    <div className="player w-100 h-100">
      <SpotifyPlayer 
        token={accessToken}
        uris={trackUri ? [trackUri] : []}
        // if we selected a valid spotify track which will pass our uri inside this component then we set uris to an array with the uri inside otherwise we give an empty array so no tracks are played.
        play={playTrack}
        callback={(state) => !state.isPlaying && setPlayTrack(false)}
        layout="responsive"
        inlineVolume={true}
        magnifySliderOnHover={true}
        hideAttribution={true}
        styles={{
          bgColor: '#fffdd0',
          color: '#000',
          loaderColor: '#000',
          sliderColor: '#6515eb',
          trackNameColor: '#000',
          sliderTrackBorderRadius: '30%'
        }}

      />
    </div>
  )
}

export default SongPlayer