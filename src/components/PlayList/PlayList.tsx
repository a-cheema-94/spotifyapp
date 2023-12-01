import { FC, useState } from 'react';
import { TrackType } from '../../data/exampleData';
import Track from '../Track/Track';


const PlayList: FC<{ playlist: TrackType[], deleteTrack: (id: number) => void, clearPlaylist: () => void }> = ({ playlist, deleteTrack, clearPlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [confirmPlaylistName, setConfirmPlaylistName] = useState(false);

  const handlePlaylistName = () => {
    if(playlistName) {
      setConfirmPlaylistName(true)
    }
  }

  return (
    <div className='playlist_container'>
      {!confirmPlaylistName ? 
      <div className="enter_playlist_name">
        <div>
          Enter: <input value={playlistName} onChange={e => setPlaylistName(e.target.value)}/>
        </div>
        <button onClick={handlePlaylistName}>Confirm</button>
      </div> : 
        <h1>{playlistName}</h1>
      }

      {playlist?.map((song) => (
        <div key={song.id} className="playlist-track">
          <Track {...song}/>
          <button title='remove from playlist' onClick={() => deleteTrack(song.id)}>-</button>
        </div>
      ))}

      <button>Add to Spotify</button>
      <button onClick={() => clearPlaylist()}>Clear Playlist</button>
    </div>
  )
}

export default PlayList