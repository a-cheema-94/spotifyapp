import { FC } from 'react';
import { Form } from 'react-bootstrap';

type HandleSearch = (e: any) => void

const SearchBar: FC<{ query: string, handleSearch: HandleSearch }> = ({ query, handleSearch }) => {

  return (
      <input className='form-control search border-2' type="text" placeholder="search for songs..." value={query} aria-label='search-bar' onChange={handleSearch}/>
  )
}

export default SearchBar