import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') return setResults([]);

    try {
      const res = await axios.get(`/api/v1/user/search?query=${value}`);
      setResults(res.data.users);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="rounded-xl"
      />
      {results.length > 0 && (
        <div className="absolute z-10 bg-white border w-full mt-2 rounded shadow-lg max-h-60 overflow-auto">
          {results.map(user => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex items-center gap-3 p-2 hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
