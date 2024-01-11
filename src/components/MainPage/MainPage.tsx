import { useState, useEffect, FC } from "react"
import SearchBar from "../SearchBar/SearchBar"
import SearchResults from "../SearchResults/SearchResults"
import { TrackType } from "../../types/types";
import PlayList from "../PlayList/PlayList";
import useAuth from "../../hooks/useAuth";
import { Container } from "react-bootstrap";
import axios from "../../api/axios";
import { v4 as uuidv4 } from 'uuid'
import SongPlayer from "../SongPlayer/SongPlayer";


const MainPage: FC<{ code: string | null }> = ({ code }) => {
  const accessToken = useAuth(code)

  const [searchResults, setSearchResults] = useState<TrackType[]>([]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
  const [query, setQuery] = useState('');
  const [currentPlayingSongUri, setCurrentPlayingSongUri] = useState<string | null>(null);


  // search call
  useEffect(() => {
    
    if(!query) return setSearchResults([]);
    if(!accessToken) return;

    let isMounted = true;

    const searchTracks = async() => {

      try {
        const res = await axios.post('/search', {
          query,
          accessToken,
        });
        
        isMounted && setSearchResults(res.data.map((track: any) => ({
          artist: track.artists[0].name,
          albumArt: track.album.images.reduce((smallestImg: any, albumImg: any) => {
            if(smallestImg.height <= albumImg.height) return smallestImg;
            return albumImg;
          }, track.album.images[0]).url,
          uri: track.uri,
          name: track.name,
          id: uuidv4(),
        })));

      } catch (error) {
        console.error(error)
      }
    }
    
      searchTracks();

      return () => {
        isMounted = false;
      }
  }, [query, accessToken])

  // playlist call function
  const makePlaylist = (playlistName: string) => {
    // make post req to server at /playlist endpoint sending playlistName and songsToAdd
    const songsToAdd = playlist.map(song => song.uri);

    const addPlaylistToSpotify = async () => {
      try {
        const res = axios.post('/playlist', {
          playlistName,
          songsToAdd,
          accessToken,
        })
        console.log(res)
      } catch(error) {
        console.log(error)
      }
    }
    addPlaylistToSpotify()
    console.log('Added playlist to spotify')
  }
  
  // functions

  const handleSearch = (e: any) => {
    setQuery(e.target.value)
  };
  
  const addPlaylistTrack = (id: string) => {
    let newPlaylistTracks: any[] = []
    const songToAdd = searchResults.find(song => song.id === id);
    newPlaylistTracks.push(songToAdd)

    setPlaylist(prevPlaylist => {
      if(prevPlaylist.find(song => song.id === id)) {
        return [ ...prevPlaylist ]
      } else {
        return [ ...prevPlaylist, ...newPlaylistTracks ]
      }
    })
  }

  const deletePlaylistTrack = (id: string) => {
    setPlaylist(prevPlaylist => {
      return prevPlaylist.filter(song => song.id !== id);
    })

  }
  
  const clearPlaylist = () => setPlaylist([]);

  const selectTrackToPlay = (track: string) => {
    setCurrentPlayingSongUri(track)
  }

  // style={{ width: '60dvw', minHeight: '50vh', }}

  return (
    <Container
      style={{
        minHeight: '100dvh', minWidth: '100dvw', overflowX: 'hidden', backgroundImage: 'url(../../../images/background_5.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="d-flex flex-column py-2 justify-content-between"
        style={{
          width: '50dvw',
          height: '80dvh',
        }}
      >

        <SearchBar query={query} handleSearch={handleSearch}/>

        <div className="d-flex justify-content-between py-4">
          {query && <SearchResults searchResults={searchResults} addTrack={addPlaylistTrack} selectTrackToPlay={selectTrackToPlay}/>}

          {playlist.length > 0 && <PlayList playlist={playlist} deleteTrack={deletePlaylistTrack} clearPlaylist={clearPlaylist} makePlaylist={makePlaylist}/>}
        </div>

        {accessToken && <SongPlayer accessToken={accessToken} trackUri={currentPlayingSongUri}/>}

      </div>

    </Container>  
  )
}

export default MainPage
