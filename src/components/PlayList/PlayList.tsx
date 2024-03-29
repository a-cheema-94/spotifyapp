import { FC, useState } from 'react';
import { PlaylistComponentType } from '../../types/types';
import Track from '../Track/Track';

const PlayList: FC<PlaylistComponentType> = ({ playlist, deleteTrack, clearPlaylist, makePlaylist, selectTrackToPlay, playWholePlaylist, togglePlayBtn }) => {
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
    <div className='search-and-playlist-sizing' data-testid='playlist-container'>
      {!confirmPlaylistName ? 
      <div className="d-flex flex-column gap-3 mb-3">

        <div className='gap-2 d-flex flex-column  align-items-center'>
          <label htmlFor='playlist-name' className='h5'>Enter Playlist Name:</label> <input aria-label='playlist-name' className='form-control w-50' value={playlistName} onChange={e => setPlaylistName(e.target.value)}/>
        </div>

        <button className='w-50 btn confirm-button playlist-button' onClick={handlePlaylistName}>Confirm</button>

      </div> :
        <div className='d-flex align-items-center justify-content-between mx-2'>
          <h1 className='mb-3 display-5'>{playlistName}</h1>
          {playlist.length > 1 && 

          <div className="d-flex gap-4">

            {togglePlayBtn === playlist && 
            
            <div aria-label='playing' role='button'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-broadcast" viewBox="0 0 16 16">
                <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>
              </svg>
            </div>}

            <div
              role='button'
              title='play whole playlist'
              onClick={() => playWholePlaylist()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fffdd0" className="bi bi-collection-play-fill" viewBox="0 0 16 16">
                <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437"/>
              </svg>
            </div>


          </div>
          
          }
        </div>
      }

      {playlist?.map((song) => (
        <div 
          key={song.id} 
          className="d-flex justify-content-between align-items-center mt-2 search-result"
          onClick={() => selectTrackToPlay(song)}
          data-testid='playlist-song'
        >
          <Track song={song} togglePlayBtn={togglePlayBtn}/>
          <div 
            title='remove from playlist'
            className='center-flex-container minus-button icon-button'
            onClick={() => deleteTrack(song.id)}
            aria-label='remove from playlist' 
            role='button'
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