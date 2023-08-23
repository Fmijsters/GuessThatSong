import React from 'react';
import './navbar.css'; // Import your CSS styles for the navbar

function Navbar() {
    return (
        <nav className="navbar">
            <div onClick={() => window.location.href = "/"} className="navbar-brand">
                Guess That Song
            </div>
            <ul className="navbar-links">
                <li><a href="/">Home</a></li>
                <li><a href="/leaderboard">Leaderboard</a></li>
                <li><a href="/spotify/authorize">Spotify</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
