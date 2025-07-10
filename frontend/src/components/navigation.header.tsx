import React, { useEffect } from 'react';
import './navbar.css'; // Import your CSS styles for the navbar

function Navbar() {

    useEffect(() => {
        console.log("Navbar mounted", window.location.href);
    }, [window.location.href]);

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div onClick={() => window.location.href = "/"} className="navbar-brand">
                    Guess That Song
                </div>
                <ul className="navbar-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/leaderboard">Leaderboard</a></li>
                    <li><a href="/spotify/authorize">Spotify</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </div>
            <div style={{ marginRight: 50 }}>
                Profile
            </div>
        </nav>
    );
}

export default Navbar;
