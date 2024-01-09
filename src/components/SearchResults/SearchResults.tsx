import { TrackType } from "../../types/types";
import Track from "../Track/Track"
import { FC } from 'react';

const SearchResults: FC<{ searchResults: TrackType[], addTrack: (id: string) => void }> = ({ searchResults, addTrack }) => {
  
  return (
    <div>
      {searchResults.map((song) => (
        <div key={song.id} className="search_result">
          <Track {...song} />
          <button title="add to playlist" onClick={() => addTrack(song.id)}>+</button>
        </div>
      ))}

      {/* {searchResults.length > 0 && <button onClick={() => clearSearchResults()}>Clear search results</button>} */}
    </div>
  )
}

export default SearchResults