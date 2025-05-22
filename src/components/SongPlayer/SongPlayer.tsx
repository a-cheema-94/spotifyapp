import { FC, useEffect, useState } from "react"
import  SpotifyPlayer  from "react-spotify-web-playback"
import { SongPlayerComponentType } from "../../types/types";

const SongPlayer: FC<SongPlayerComponentType> = ({ accessToken, trackUri }) => {

  return (
    <div className="player w-100 h-100" data-testid="song-player">
      <SpotifyPlayer 
        token={accessToken}
        uris={trackUri}
        // if we selected a valid spotify track which will pass our uri inside this component then we set uris to an array with the uri inside otherwise we give an empty array so no tracks are played.
        play={true}
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