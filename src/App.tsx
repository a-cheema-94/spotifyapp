import { useState } from "react"
import SearchBar from "./components/SearchBar/SearchBar"
import SearchResults from "./components/SearchResults/SearchResults"
import { TrackType, sampleArtistData } from "./data/exampleData";
import PlayList from "./components/PlayList/PlayList";

function App() {
  const [searchResults, setSearchResults] = useState<TrackType[]>([...sampleArtistData]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
  const[query, setQuery] = useState('');
  
  // functions

  // setSearchResults based on api and query
  
  const handleSearch = (e: any) => setQuery(e.target.value);
  
  const addPlaylistTrack = (id: number) => {
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

  const deletePlaylistTrack = (id: number) => {
    setPlaylist(prevPlaylist => {
      return prevPlaylist.filter(song => song.id !== id);
    })

  }
  
  const clearPlaylist = () => setPlaylist([]);


  return (
    <div className="front_page">
      <SearchBar query={query} handleSearch={handleSearch}/>
      <div className="results_and_playlist">
        {query && <SearchResults searchResults={searchResults} addTrack={addPlaylistTrack} />}
        {playlist.length > 0 && <PlayList playlist={playlist} deleteTrack={deletePlaylistTrack} clearPlaylist={clearPlaylist}/>}
      </div>
    </div>  
  )
}

export default App
