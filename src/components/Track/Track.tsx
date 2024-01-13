import { FC } from 'react';
import { TrackType } from '../../types/types';

const Track = (song: TrackType) => {
  const { name, artist, albumArt, uri, id } = song;

  return (
    <div className="d-flex align-items-center gap-2 p-2">
      <img src={albumArt} alt="" />

      <div>
        <div className="h6">{name}</div>
        <div className="text-body-secondary">{artist}</div>
      </div>
    </div>
  )
}

export default Track