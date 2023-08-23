import axios from "axios";
import {useState} from "react";
import Navbar from "./navigation.header";
import Checkbox from "./checkbox.component";

function createPub(pub) {
    const apiUrl = 'http://192.168.0.104:8000/api/pubs/createpub';
    axios.post(apiUrl, pub, {headers: {Authorization: "Token " + localStorage.getItem('authToken')}})
        .then(response => {
            console.log(response.data)
            if (response.data.id)
                window.location.href = "/pub/" + response.data.id
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function searchArtistsOrTracks(query, setSearchResults, type) {
    const apiUrl = "https://api.spotify.com/v1/search"
    const at = localStorage.getItem("access_token")
    axios.get(apiUrl, {params: {q: query, type: type, limit: 20}, headers: {Authorization: "Bearer " + at}})
        .then(searchResults => {
            console.log(searchResults)
            let results = searchResults.data[type + 's'].items.map(result => {
                if (type === "track")
                    return {
                        name: result.name,
                        id: result.id,
                        type: type,
                        artist: result.artists.map(artist => artist.name).join(" & "),
                        profile_picture: result.album.images.length > 0 ? result.album.images[0].url : ""

                    }
                else if (type === "playlist") {
                    return {
                        name: result.name,
                        id: result.id,
                        type: type,
                        artist: result.owner.display_name,
                        profile_picture: result.images.length > 0 ? result.images[0].url : "",
                        href: result.tracks.href,
                        tracks: result.tracks.total

                    }
                }
                return {
                    name: result.name,
                    id: result.id,
                    type: type,
                    profile_picture: result.images.length > 0 ? result.images[0].url : ""
                }
            })
            setSearchResults(results)

        })
        .catch(error => {
            if (error.response.status === 401) {
                localStorage.removeItem("access_token")
                window.location.href = "/spotify/authorize"
            }
            console.log(error.response.status)
            console.log(error)
        })
}

function generateRecommendations(selectedSeeds, setTrackList, tracklist, minPopularity, maxPopularity) {
    const apiUrl = "https://api.spotify.com/v1/recommendations"
    const at = localStorage.getItem("access_token")
    let artists = []
    let tracks = []
    let genres = []
    selectedSeeds.forEach(seed => {
        switch (seed.type) {
            case "artist":
                artists.push(seed.id)
                break
            case "track":
                tracks.push(seed.id)
                break
            case "genre":
                genres.push(seed.name)
                break
        }
    })
    axios.get(apiUrl, {
        params: {
            limit: 100,
            seed_artists: artists.toString(),
            seed_tracks: tracks.toString(),
            seed_genres: genres.toString(),
            min_popularity: minPopularity,
            max_popularity: maxPopularity
        }, headers: {Authorization: "Bearer " + at}
    })
        .then(searchResults => {
            let newTrackList = []
            searchResults.data.tracks.forEach((searchResult, i) => {
                if (searchResult.preview_url) {
                    let albumCover;
                    if (searchResult.album.images.length > 0) {
                        albumCover = searchResult.album.images[0]
                    }
                    let track = {
                        albumCover: albumCover,
                        name: searchResult.name,
                        artists: [],
                        previewUrl: searchResult.preview_url,
                        id: searchResult.id
                    }
                    searchResult.artists.forEach(artist => {
                        track.artists.push({name: artist.name, id: artist.id})
                    })
                    newTrackList.push(track)
                }

            })
            const finalTrackList = [].concat(newTrackList)
            for (const track of tracklist) {
                let found = false
                for (const track2 of finalTrackList) {
                    if (track2.name === track.name) {
                        console.log("Duplicate", track2, track)
                        found = true
                        break
                    }
                }
                if (!found) {
                    finalTrackList.push(track)
                }
            }
            setTrackList(finalTrackList)


        })
        .catch(error => {
            if (error.response.status === 401) {
                localStorage.removeItem("access_token")
                window.location.href = "/spotify/authorize"
            }
            console.log(error.response.status)
            console.log(error)
        })
}

function addPlaylistSongsToSongList(href: string, setTrackList, tracklist) {
    let at = localStorage.getItem("access_token")
    axios.get(href, {params: {limit: 100}, headers: {Authorization: "Bearer " + at}}).then(result => {
        let newTrackList = []
        result.data.items.forEach((searchResult, i) => {
            searchResult = searchResult.track
            console.log(searchResult.name)
            if (searchResult.preview_url) {
                let albumCover;
                if (searchResult.album.images.length > 0) {
                    albumCover = searchResult.album.images[0]
                }
                let track = {
                    albumCover: albumCover,
                    name: searchResult.name,
                    artists: [],
                    previewUrl: searchResult.preview_url,
                    id: searchResult.id
                }
                searchResult.artists.forEach(artist => {
                    track.artists.push({name: artist.name, id: artist.id})
                })
                newTrackList.push(track)
            }

        })
        const finalTrackList = [].concat(newTrackList)
        for (const track of tracklist) {
            let found = false
            for (const track2 of finalTrackList) {
                if (track2.name === track.name) {
                    found = true
                    break
                }
            }
            if (!found) {
                finalTrackList.push(track)
            }
        }
        setTrackList(finalTrackList)
        if (result.data.next) {
            addPlaylistSongsToSongList(result.data.next, setTrackList, finalTrackList)
        }
    })
}

export default function CreatePubPage() {
    const [up, setUp] = useState(0)
    const [minPopularity, setMinPopularity] = useState(40)
    const [maxPopularity, setMaxPopularity] = useState(100)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [type, setType] = useState("tp")
    const [maxMembers, setMaxMembers] = useState(6)
    const [teams, setTeams] = useState(false)
    const [artist, setArtist] = useState("")
    const [rounds, setRounds] = useState(10)
    const [track, setTrack] = useState("")
    const [playlist, setPlaylist] = useState("")
    const [selectedSeeds, setSelectedSeeds] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [trackList, setTrackList] = useState([])
    const [searchType, setSearchType] = useState("genre")
    const [selectedGenre, setSelectedGenre] = useState("emo")
    const availableGenres =
        ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]
    let spotify = <span style={{color: "#0F0"}}>Spotify Authorized</span>
    let at = localStorage.getItem("access_token")
    if (at === null || at === undefined || at === "") {
        spotify = <a href={"/spotify/authorize"}>Authorize spotify</a>
    }
    let searchResultsDisplay = <></>
    if (searchResults.length > 0) {
        searchResultsDisplay = <div className={"search-result-container"}>
            {searchResults.map(artist => {
                return <div className={"search-result"}
                            onClick={(e) => {
                                setSearchResults([])
                                setArtist("")
                                if (artist.type === "playlist") {
                                    addPlaylistSongsToSongList(artist.href, setTrackList, trackList);
                                    return
                                }


                                let selectedSeedsCopy = selectedSeeds
                                selectedSeedsCopy.push(artist)
                                setSelectedSeeds(selectedSeedsCopy)
                            }}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%"}}>

                        <span key={artist.id}>{artist.name}</span>
                        <span
                            style={{
                                display: artist.artist ? "inline-block" : "none",
                                fontStyle: "italic"
                            }}>{artist.artist}</span>
                        <span
                            style={{
                                display: artist.tracks ? "inline-block" : "none",
                                fontSize: 10
                            }}>Songs: {artist.tracks}</span>

                    </div>
                    <img style={{maxWidth: 50, maxHeight: 50}} src={artist.profile_picture}/>
                </div>
            })}
        </div>
    }
    let selectedArtistsDisplay;
    if (selectedSeeds.length > 0) {
        selectedArtistsDisplay = (
            <div style={{display: "flex", flexDirection: "row", marginBottom: 10, marginTop: 10, flexWrap: "wrap"}}>
                {selectedSeeds.map(seed => {
                    return <div key={seed.type === "genre" ? seed.name : seed.id}
                                className={"seed-label"}>
                        <span>
                            {seed.type}: {seed.name}
                        </span>

                        <span onClick={() => {
                            let selectedSeedsCopy = selectedSeeds
                            setSelectedSeeds(selectedSeedsCopy.filter(selSeed => {
                                    return seed.name !== selSeed.name
                                })
                            )
                        }} style={{color: "#F00", marginLeft: 5}}>X</span>
                    </div>

                })}
            </div>
        )
    }
    let totalSongs = <span>{trackList.length}</span>
    let searchBox;
    if (selectedSeeds.length < 5) {
        switch (searchType) {
            case "artist":
                searchBox = <>
                    <div className={"create-pub-input-row"} style={{marginBottom: 0}}>

                        <input style={{borderRadius: searchResults.length > 0 ? "5px 5px 0 0" : "", width: "100%"}}
                               id={"artist"} value={artist}
                               onChange={(e) => {
                                   setArtist(e.target.value)
                                   if (e.target.value.length > 0 && e.target.value !== "")
                                       searchArtistsOrTracks(artist, setSearchResults, "artist")
                                   else
                                       setSearchResults([])
                               }}/>

                    </div>
                </>
                break
            case "playlist":
                searchBox = <>
                    <div
                        style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                        <input style={{borderRadius: searchResults.length > 0 ? "5px 5px 0 0" : "", width: "100%"}}
                               id={"playlist"} value={playlist} onChange={(e) => {
                            setPlaylist(e.target.value)
                            if (e.target.value.length > 0 && e.target.value !== "")
                                searchArtistsOrTracks(playlist, setSearchResults, "playlist")
                            else
                                setSearchResults([])
                        }}/>

                    </div>
                </>
                break
            case "track":
                searchBox = <>
                    <div
                        style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                        <input style={{borderRadius: searchResults.length > 0 ? "5px 5px 0 0" : "", width: "100%"}}
                               id={"track"} value={track} onChange={(e) => {
                            setTrack(e.target.value)
                            if (e.target.value.length > 0 && e.target.value !== "")
                                searchArtistsOrTracks(track, setSearchResults, "track")
                            else
                                setSearchResults([])
                        }}/>

                    </div>
                </>
                break
            case "genre":
                searchBox =
                    <div
                        style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <select
                            value={selectedGenre}
                            onChange={(e) => {
                                setSelectedGenre(e.target.value)
                            }}>
                            <option key={""} value={"empty"}></option>
                            {availableGenres.filter(genre => {
                                return !selectedSeeds.map(seed => seed.name).includes(genre)
                            }).map((genre, i) => {
                                return <option key={i}
                                               value={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</option>
                            })}

                        </select>
                        <button className={"secondary-button"} onClick={() => {
                            if (selectedGenre === "empty")
                                return
                            let selectedSeedsCopy = selectedSeeds
                            selectedSeedsCopy.push({name: selectedGenre, type: "genre"})
                            setSelectedSeeds(selectedSeedsCopy)
                            setSelectedGenre("empty")
                        }}>Add to Seed
                        </button>
                    </div>

        }
    }
    let generateRecommendationsButton;
    if (selectedSeeds.length > 0) {
        generateRecommendationsButton =
            <div style={{width: "100%", marginTop: 10}}>
                <label>Popularity</label>
                <div className={"create-pub-input-row"}>
                    <label>Min</label>
                    <input id={'minPopularity'} value={minPopularity} min={0} max={maxPopularity - 1}
                           type={"number"}
                           onChange={(e) => setMinPopularity(parseInt(e.target.value))}/>
                    <label>Max</label>

                    <input id={'maxPopularity'} value={maxPopularity} min={minPopularity + 1} max={100}
                           type={"number"}
                           onChange={(e) => setMaxPopularity(parseInt(e.target.value))}/>

                </div>
                <button className={"main-button"} style={{margin: 10}}
                        onClick={() => generateRecommendations(selectedSeeds, setTrackList, trackList, minPopularity, maxPopularity)}>Generate
                    Recommendations
                </button>
            </div>
    }
    let shouldShowCreate = trackList.length < 20 && name !== "";
    return (<>

        <Navbar/>
        <h1 style={{marginLeft: "auto", marginRight: "auto", width: "fit-content"}}>Create your own Pub</h1>
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-evenly",
                width: "100%",
                maxWidth: 1100,
                marginLeft: "auto",
                marginRight: "auto"
            }}>
            <div style={{display: "flex", flexDirection: "column", width: 300, alignItems: "flex-start"}}>
                <div
                    className={"create-pub-input-row"}>
                    <label htmlFor={"name"}>Name</label>
                    <input id={'name'} value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <span style={{fontSize: 12}}>Pub passwords are saved in plaintext use something random plz.
                    Account passwords are properly encrypted but couldnt be bothered for the pubs</span>
                <div
                    className={"create-pub-input-row"}>

                    <label htmlFor={"password"}>Password</label>
                    <input id={"password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div
                    className={"create-pub-input-row"}>

                    <label htmlFor={"maxMembers"}>Max Members</label>
                    <input id={"maxMembers"} value={maxMembers} type={"number"} min={1}
                           onChange={(e) => setMaxMembers(parseInt(e.target.value))}/>
                </div>
                <div
                    className={"create-pub-input-row"}>

                    <label htmlFor={"teams"}>Teams</label>
                    <Checkbox onChange={(e) => setTeams(e.target.checked)} checked={teams}/>
                </div>
                <div className={"create-pub-input-row"}>
                    <label htmlFor={"type"}>Type</label>
                    <select id={"type"} defaultValue={type} onChange={(e) => setType(e.target.value)}>
                        <option value={'tp'}>Typing Game</option>
                        <option value={'mc'}>Multiple Choice Game</option>
                    </select>
                </div>
                <div className={"create-pub-input-row"}>
                    <label htmlFor={"rounds"}>Rounds</label>
                    <input id={"rounds"} type={"number"} value={rounds}
                           onChange={(e) => setRounds(parseInt(e.target.value))} min={1}/>
                </div>
                <button className={"main-button"}
                        style={{display: trackList.length >= 20 ? "" : "none", width: "100%", marginTop: 20}}
                        onClick={() => createPub({
                            name: name,
                            password: password,
                            type: type,
                            teams: teams,
                            maxMembers: maxMembers,
                            trackList: trackList,
                            rounds: rounds
                        })}>Create
                </button>
            </div>
            <div style={{display: "flex", flexDirection: "column", width: 300, alignItems: "flex-start"}}>
                <span>Selected Seeds <span
                    style={{color: selectedSeeds.length === 5 ? "#F00" : "#0F0"}}>{selectedSeeds.length}/5</span>:</span>
                {selectedArtistsDisplay}
                <br/>
                <span>Total songs in list</span>
                {totalSongs}
                <br/>

                <div
                    style={{
                        marginBottom: 5,
                        display: selectedSeeds.length < 5 ? "flex" : "none",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%"
                    }}>
                    <label htmlFor={"searchType"}>Search Type</label>
                    <select id={"searchType"} defaultValue={searchType}
                            onChange={(e) => setSearchType(e.target.value)}>
                        <option key={'artist'} value={'artist'}>Artist</option>
                        <option key={'track'} value={'track'}>Track</option>
                        <option key={'playlist'} value={'playlist'}>Playlist</option>
                        <option key={'genre'} value={'genre'}>Genre</option>
                    </select>
                </div>


                {searchBox}
                {searchResultsDisplay}
                {generateRecommendationsButton}
                <br/>
                <span style={{display: shouldShowCreate ? "" : "none", fontSize: 12}}>Make sure that there are atleast 20 songs in the tracklist</span>

            </div>
        </div>

    </>)
}

