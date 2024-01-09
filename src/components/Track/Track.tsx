import { FC } from 'react';
import { TrackType } from '../../types/types';

const Track = (song: TrackType) => {
  const { name, artist, albumArt, uri, id } = song;

  return (
    <div className="track_container">
      <div className="name">{name}</div>
      <div className="name">{artist}</div>
      <div className="name">{albumArt}</div>
    </div>
  )
}

export default Track