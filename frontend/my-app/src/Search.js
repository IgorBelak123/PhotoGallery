import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    setErrorMessage('');
    try {
      const response = await axios.get('http://localhost:5000/search', {
        params: { keyword },
      });
      setResults(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
      console.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Search Pictures by Keyword</h2>
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <img src={result.file_url || `http://localhost:5000/uploads/files/${result.filename}`} alt={result.description} width="100" />
            <p><strong>Description:</strong> {result.description}</p>
            <p><strong>Keyword:</strong> {result.keyword}</p>
            <p><strong>Uploaded by:</strong> {result.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
