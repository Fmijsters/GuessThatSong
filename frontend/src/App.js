import logo from './logo.svg';
import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./components/home.page";
import LoginPage from "./components/login.page";
import PubPage from "./components/pub.page";
import AuthorizeSpotifyPage from "./components/authorizespotify.page";
import CreatePubPage from "./components/createpub.page";
import CreateUserPage from "./components/createuser.page";
import LeaderboardPage from "./components/leaderboard.page";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/pub/:pubId" element={<PubPage/>}/>
                <Route exact path="/spotify/authorize" element={<AuthorizeSpotifyPage/>}/>
                <Route exact path={"/createpub"} element={<CreatePubPage/>}/>
                <Route exact path={"/leaderboard"} element={<LeaderboardPage/>}/>
                <Route exact path={"/createuser"} element={<CreateUserPage/>}/>
                <Route exact path="/login" element={<LoginPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
