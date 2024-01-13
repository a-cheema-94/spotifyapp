import { FC, useState } from 'react';
import { TrackType } from '../../types/types';
import Track from '../Track/Track';


const PlayList: FC<{ playlist: TrackType[], deleteTrack: (id: string) => void, clearPlaylist: () => void, makePlaylist: (playlistName: string) => void  }> = ({ playlist, deleteTrack, clearPlaylist, makePlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [confirmPlaylistName, setConfirmPlaylistName] = useState(false);

  const handlePlaylistName = () => {
    if(playlistName) {
      setConfirmPlaylistName(true)
    }
  }

  const postPlaylistOnSpotify = () => {
    clearPlaylist()
    setPlaylistName('')
    setConfirmPlaylistName(false)
    makePlaylist(playlistName)
  }

  return (
    <div className='search-and-playlist-sizing'>
      {!confirmPlaylistName ? 
      <div className="d-flex flex-column gap-3 mb-3">

        <div className='gap-2 d-flex flex-column  align-items-center'>
          <span className='h5'>Enter Playlist Name:</span> <input className='form-control w-50' value={playlistName} onChange={e => setPlaylistName(e.target.value)}/>
        </div>

        <button className='w-50 btn confirm-button playlist-button' onClick={handlePlaylistName}>Confirm</button>

      </div> : 
        <h1 className='mb-3 display-5'>{playlistName}</h1>
      }

      {playlist?.map((song) => (
        <div key={song.id} className="d-flex justify-content-between align-items-center mt-2 search-result">
          <Track {...song}/>
          <div 
            title='remove from playlist'
            className='center-flex-container minus-button icon-button'
            onClick={() => deleteTrack(song.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
          </div>
        </div>
      ))}

      <div className='d-flex gap-3 mt-2 justify-content-center flex-wrap'>
        <button className='btn confirm-button playlist-button ' onClick={postPlaylistOnSpotify}>Add to Spotify</button>
        <button className='btn deny-button playlist-button ' onClick={() => clearPlaylist()}>Clear Playlist</button>
      </div>
    </div>
  )
}

export default PlayList