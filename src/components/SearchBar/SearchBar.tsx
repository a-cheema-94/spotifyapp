import { FC } from 'react';
import { SearchBarComponentType } from '../../types/types';


const SearchBar: FC<SearchBarComponentType> = ({ query, handleSearch }) => {

  return (
      <input className='form-control search border-2 mt-2' type="text" placeholder="search for songs..." value={query} aria-label='search-bar' onChange={handleSearch}/>
  )
}

export default SearchBar