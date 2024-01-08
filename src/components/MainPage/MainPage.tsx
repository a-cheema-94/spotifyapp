import { useState, useEffect, FC } from "react"
import SearchBar from "../SearchBar/SearchBar"
import SearchResults from "../SearchResults/SearchResults"
import { TrackType, sampleArtistData } from "../../data/exampleData";
import PlayList from "../PlayList/PlayList";
import Spotify from "../../data/auth_and_api_calls";

const MainPage: FC<{ code: string | null }> = ({ code }) => {
  const [searchResults, setSearchResults] = useState<TrackType[]>([...sampleArtistData]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
  const[query, setQuery] = useState('');

  // useEffect(() => {
  //   async function getAccessToken(code: any) {
  //     const res = await fetch('')
  //   }
  // }, [])

  // window.
  
  const handleSearch = (e: any) => {
    Spotify.getAccessToken(code)
    setQuery(e.target.value)
  };
  
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
      {/* player */}
    </div>  
  )
}

export default MainPage
