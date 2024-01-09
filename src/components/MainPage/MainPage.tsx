import { useState, useEffect, FC } from "react"
import SearchBar from "../SearchBar/SearchBar"
import SearchResults from "../SearchResults/SearchResults"
import { TrackType } from "../../types/types";
import PlayList from "../PlayList/PlayList";
import useAuth from "../../hooks/useAuth";
import { Container } from "react-bootstrap";
import axios from "../../api/axios";
import { v4 as uuidv4 } from 'uuid'


const MainPage: FC<{ code: string | null }> = ({ code }) => {
  const accessToken = useAuth(code)

  const [searchResults, setSearchResults] = useState<TrackType[]>([]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
  const[query, setQuery] = useState('');

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


  return (
    <Container className="d-flex flex-column py-2">
      <SearchBar query={query} handleSearch={handleSearch}/>
      <div className="results_and_playlist">

        {query && <SearchResults searchResults={searchResults} addTrack={addPlaylistTrack} />}

        {playlist.length > 0 && <PlayList playlist={playlist} deleteTrack={deletePlaylistTrack} clearPlaylist={clearPlaylist}/>}

      </div>
    </Container>  
  )
}

export default MainPage
