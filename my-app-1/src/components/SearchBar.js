import React, { useState} from 'react';
import '../style.css';
import CricketerStats from './CricketerStats';
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [playerID, setPlayerID] = useState(null);
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {

      fetch(`https://api.cricapi.com/v1/players?apikey=cc97b460-e3c5-41b2-a645-3e8fd5d18e8b&offset=0&search=${query}`)
          .then(res => res.json())
          .then(data => setPlayerID(data.data[0].id))
  
  };

  return (
    < div className='search'>
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
    </div>
     <CricketerStats playerID = {playerID}/>
    </div>
  );
};

export default SearchBar;
