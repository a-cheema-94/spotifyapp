import { FC } from 'react';
import { TrackType } from "../../data/exampleData"

const Track = (song: TrackType) => {
  const { name, artist, album } = song;

  return (
    <div className="track_container">
      <div className="name">{name}</div>
      <div className="name">{artist}</div>
      <div className="name">{album}</div>
    </div>
  )
}

export default Track