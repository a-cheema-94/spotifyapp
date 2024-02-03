import { useState, useEffect, FC } from "react"
import SearchBar from "../SearchBar/SearchBar"
import SearchResults from "../SearchResults/SearchResults"
import { TrackType } from "../../types/types";
import PlayList from "../PlayList/PlayList";
import useAuth from "../../hooks/useAuth";
import { Container, Toast } from "react-bootstrap";
import axios from "../../api/axios";
import { v4 as uuidv4 } from 'uuid'
import SongPlayer from "../SongPlayer/SongPlayer";


const MainPage: FC<{ code: string | null }> = ({ code }) => {
  const accessToken = useAuth(code)

  const [searchResults, setSearchResults] = useState<TrackType[]>([]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
  const [query, setQuery] = useState('');
  const [currentPlayingSongUri, setCurrentPlayingSongUri] = useState<string[] | null>(null);
  const [theme, setTheme] = useState<string>('green');
  const [selectedSong, setSelectedSong] = useState<TrackType | TrackType[] | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);


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
    setShowToast(true)
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

  const selectTrackToPlay = (track: TrackType) => {
    setSelectedSong(track)
    setCurrentPlayingSongUri([track.uri])
  }

  const playWholePlaylist = () => {
    setSelectedSong(null)
    let queuedPlaylist = playlist.map(song => song.uri);
    setCurrentPlayingSongUri(queuedPlaylist)
    setSelectedSong(playlist)
  }


  // dynamically preload images before that particular theme is selected.
  const preloadImage = (image: string) => {

    // remove all previous preload links so only have one at a time corresponding to the 'active' theme
    const currentPreloadLinks = document.querySelectorAll('link[rel="preload"]');
    currentPreloadLinks.forEach(link => link.remove());

    // create link and add to the DOM
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = image;
    link.as = 'image';
    link.type = 'image/svg+xml'
    document.head.appendChild(link)
  }

  const chooseTheme = (color: string) => {
    preloadImage(`./images/${color}.svg`)
    setTheme(color)
  }


  return (
    <Container
      className="center-flex-container main-pages-sizing pb-5 position-relative"
      style={{
        overflowX: 'hidden',
        backgroundImage: `url(../../../images/${theme}.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* themes */}
      <div className="position-absolute top-0 end-0 d-flex gap-2 mt-3" style={{ paddingRight: '2rem', }}>
        <button className="theme-button green-theme-button" onClick={() => chooseTheme('green')}></button>
        <button className="theme-button purple-theme-button" onClick={() => chooseTheme('purple')}></button>
        <button className="theme-button blue-theme-button" onClick={() => chooseTheme('blue')}></button>
        <button className="theme-button red-theme-button" onClick={() => chooseTheme('red')}></button>
      </div>
      
      <div className="d-flex flex-column py-2 justify-content-between"
        style={{
          width: '50dvw',
          height: '80dvh',
        }}
      >

        <SearchBar query={query} handleSearch={handleSearch}/>

        <div className="search-and-playlist py-4">
          {query && <SearchResults searchResults={searchResults} addTrack={addPlaylistTrack} selectTrackToPlay={selectTrackToPlay} togglePlayBtn={selectedSong}/>}

          {playlist.length > 0 && <PlayList playlist={playlist} deleteTrack={deletePlaylistTrack} clearPlaylist={clearPlaylist} makePlaylist={makePlaylist} selectTrackToPlay={selectTrackToPlay} playWholePlaylist={playWholePlaylist} togglePlayBtn={selectedSong}/>}
        </div>

        {accessToken && <SongPlayer accessToken={accessToken} trackUri={currentPlayingSongUri} />}

      </div>

      {showToast && 
        <div 
          className="position-absolute top-50"
          style={{
            width: '20%',
            right: '2rem',
          }}
        >
          <Toast className="bg-success text-white" onClose={() => setShowToast(false)} delay={3000} autohide>
            <Toast.Header className="d-flex justify-content-between">
              <strong className="">Success</strong>
            </Toast.Header>
            <Toast.Body>
              Playlist Created
            </Toast.Body>
          </Toast>
        </div>}

    </Container>
  )
}

export default MainPage
