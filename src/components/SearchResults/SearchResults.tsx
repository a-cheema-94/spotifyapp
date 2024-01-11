import { TrackType } from "../../types/types";
import Track from "../Track/Track"
import { FC } from 'react';

const SearchResults: FC<{ searchResults: TrackType[], addTrack: (id: string) => void, selectTrackToPlay: (track: string) => void }> = ({ searchResults, addTrack, selectTrackToPlay }) => {
  
  return (
    <div className="w-75 p-2"
      style={{
        maxHeight: '60dvh',
        overflowY: "scroll"
      }}
    >
      {searchResults.map((song) => (
        <div key={song.id} onClick={()=> selectTrackToPlay(song.uri)}>
          <Track {...song} />
          <button title="add to playlist" onClick={() => addTrack(song.id)}>+</button>
        </div>
      ))}

      {/* {searchResults.length > 0 && <button onClick={() => clearSearchResults()}>Clear search results</button>} */}
    </div>
  )
}

export default SearchResults