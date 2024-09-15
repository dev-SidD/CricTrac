import React, { useState} from 'react';
import '../style.css';
import CricketerStats from './CricketerStats';
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [playerID, setPlayerID] = useState(null);
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  function toProperCase(name) {
    // List of common lowercase words (e.g., prepositions, articles) in names
    const lowercaseWords = ['de', 'van', 'von', 'da', 'di', 'le', 'la'];
  
    return name.split(' ').map(word => {
      // Keep initials (like AB) fully uppercase
      if (word === word.toUpperCase() && word.length <= 2) {
        return word;
      }
      // Handle known lowercase words like "de" or "van"
      if (lowercaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      // Capitalize the first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }
  

  const handleSearch = () => {
    

      fetch(`https://api.cricapi.com/v1/players?apikey=cc97b460-e3c5-41b2-a645-3e8fd5d18e8b&offset=0&search=${toProperCase(query)}`)
          .then(res => res.json())
          .then(data => setPlayerID(data.data[0].id))
  
  };

  return (
    < div className='search'>
    <div className="search-bar animate__animated animate__lightSpeedInLeft">
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
