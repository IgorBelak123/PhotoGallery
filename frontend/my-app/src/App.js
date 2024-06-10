import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Register from './Register';
import Login from './Login';
import Upload from './Upload';
import UserUploads from './UserUploads';
import { UserProvider, UserContext } from './UserContext';
import UsersList from './UsersList';
import Search from './Search';
import Messages from './Messages';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Header />
          <div className="main-content">
            <UsersList />
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/my-uploads" element={<UserUploads />} />
              <Route path="/search" element={<Search />} /> {/* Add route for search */}
              <Route path="/messages" element={<Messages />} /> {/* Add route for messages */}
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="header">
      <h2>Home</h2>
      {user ? (
        <div style={{ float: 'right' }}>
          <p>Logged in as {user.username}</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <button onClick={() => navigate('/upload')}>Upload Picture</button>
          <button onClick={() => navigate('/my-uploads')}>See All Uploaded Pictures</button>
          <button onClick={() => navigate('/search')}>Search Pictures</button> {/* Add button for search */}
          <button onClick={() => navigate('/messages')}>Messages</button> {/* Add button for messages */}
        </div>
      ) : (
        <div style={{ float: 'right' }}>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        </div>
      )}
    </div>
  );
}

function Home() {
  return (
    <div>
      <p>Welcome to the Home Page</p>
    </div>
  );
}

export default App;
