import { FC } from 'react';
import { TrackType } from '../../types/types';

const Track = (song: TrackType) => {
  const { name, artist, albumArt, uri, id } = song;

  return (
    <div className="">
      <div className="">{name}</div>
      <div className="">{artist}</div>
      {/* <div className="name">{albumArt}</div> */}
    </div>
  )
}

export default Track