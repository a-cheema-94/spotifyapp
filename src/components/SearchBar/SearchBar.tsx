import { FC } from 'react';

type HandleSearch = (e: any) => void

const SearchBar: FC<{ query: string, handleSearch: HandleSearch }> = ({ query, handleSearch }) => {

  return (
    <div>
      <input type="" name="search" id="search" placeholder="search..." value={query} onChange={handleSearch}/>
      <button>
        search icon
      </button>
    </div>
  )
}

export default SearchBar