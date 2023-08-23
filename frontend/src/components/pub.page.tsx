import {useParams} from "react-router";
import axios from "axios";
import {useEffect, useState} from "react";
import WebSocketComponent from "./websocket.page";
import AudioplayerComponent from "./audioplayer.component";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from "./navigation.header";
import './pub.css'
import GuessfieldComponent from "./guessfield.component";
import AlertComponent from "./alert.component";
import Podium from "./podium.component";

const getInterpolatedColor = (percentage) => {
    const primaryColor = '#1DB954';
    const secondaryColor = '#FFC107';
    const tertiaryColor = '#B91D41';


    if (percentage > 66) {
        return primaryColor;
    } else if (percentage > 33) {
        const interpolation = (percentage - 33) / 33; // Interpolate between secondary and primary
        const r = Math.round(interpolation * (parseInt(primaryColor.substring(1, 3), 16) - parseInt(secondaryColor.substring(1, 3), 16)) + parseInt(secondaryColor.substring(1, 3), 16));
        const g = Math.round(interpolation * (parseInt(primaryColor.substring(3, 5), 16) - parseInt(secondaryColor.substring(3, 5), 16)) + parseInt(secondaryColor.substring(3, 5), 16));
        const b = Math.round(interpolation * (parseInt(primaryColor.substring(5, 7), 16) - parseInt(secondaryColor.substring(5, 7), 16)) + parseInt(secondaryColor.substring(5, 7), 16));
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        const interpolation = percentage / 33; // Interpolate between tertiary and secondary
        const r = Math.round(interpolation * (parseInt(secondaryColor.substring(1, 3), 16) - parseInt(tertiaryColor.substring(1, 3), 16)) + parseInt(tertiaryColor.substring(1, 3), 16));
        const g = Math.round(interpolation * (parseInt(secondaryColor.substring(3, 5), 16) - parseInt(tertiaryColor.substring(3, 5), 16)) + parseInt(tertiaryColor.substring(3, 5), 16));
        const b = Math.round(interpolation * (parseInt(secondaryColor.substring(5, 7), 16) - parseInt(tertiaryColor.substring(5, 7), 16)) + parseInt(tertiaryColor.substring(5, 7), 16));
        return `rgb(${r}, ${g}, ${b})`;
    }
};

function getPub(pubId, setPub) {
    const apiUrl = 'http://192.168.0.104:8000/api/pubs/get/' + pubId + "/";
    axios.get(apiUrl)
        .then(response => {
            setPub(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

export default function PubPage() {
    const {pubId} = useParams();
    const [pub, setPub] = useState({name: ""});
    const [time, setTime] = useState(null);
    const [seek, setSeek] = useState(null);
    const [song, setSong] = useState("")
    const [previewUrl, setPreviewUrl] = useState("")
    const [artists, setArtists] = useState([])
    const [scoreboard, setScoreBoard] = useState([])
    const [socket, setSocket] = useState(null)
    const [roundOver, setRoundOver] = useState(false)
    const [paused, setPaused] = useState(false)
    const [endRoundInfo, setEndRoundInfo] = useState({
        fastestGuess: "0",
        fastestGuesser: "",
        albumCover: "",
    })
    const [roundInfo, setRoundInfo] = useState({
        currentRound: 0,
        maxRounds: 0,
        gameOver: false
    })
    const [canPlayConfetti, setCanPlayConfetti] = useState(true)
    const [alertMessage, setAlertMessage] = useState({})
    useEffect(() => {
        getPub(pubId, setPub);
    }, [pubId]); // Call getPub when pubId changes
    let percentage = parseInt(time) * 100 / 30
    let color = getInterpolatedColor(percentage)
    // @ts-ignore
    return (<>
        <Navbar/>
        <div className={"explosion-container"} id="explosion-container"></div>
        <div className={"pub-container"}>
            <div className={"pub-time-guess"}>
                <div style={{width: 200, height: 200, maxWidth: 300}}>
                    <CircularProgressbar minValue={0} value={parseInt(time)} text={time} maxValue={30} strokeWidth={15}
                                         styles={{
                                             path: {stroke: color, strokeLinecap: 'butt'}, trail: {
                                                 stroke: '#d6d6d600',
                                             }, text: {
                                                 fill: color,
                                                 fontSize: '16px',
                                             },
                                         }}/>
                </div>
                <AudioplayerComponent seek={seek} audioUrl={previewUrl} paused={paused}/>


                <br/>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    maxWidth: 300,
                    justifyContent: "center",
                    flexWrap: "wrap"
                }}>
                    {song.split(" ").filter(word => word !== "").map(songPart => {

                        return <><GuessfieldComponent text={songPart} animate={!songPart.includes("_")}/>
                        </>
                    })}
                </div>


                {artists.map(artist => {
                    return <div style={{
                        display: "flex",
                        flexDirection: "row",
                        maxWidth: 300,
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}>
                        {artist.split(" ").filter(word => word !== "").map(artistPart => {
                            return <GuessfieldComponent text={artistPart} animate={!artistPart.includes("_")}/>
                        })}
                    </div>
                })}
                <br/>

                <WebSocketComponent pubId={pubId}
                                    randomString={Math.floor(Math.random() * (100 - 10 + 1)) + 10}
                                    setRoundOver={(round_over) => {
                                        setRoundOver(round_over)
                                    }}
                                    setTime={(time) => {
                                        setTime(time)
                                    }}
                                    setSong={(song) => {
                                        setSong(song)
                                    }}
                                    setArtists={(artist) => {
                                        setArtists(artist)
                                    }}
                                    setPreviewUrl={(previewUrl) => {
                                        setPreviewUrl(previewUrl)
                                    }}
                                    setScoreBoard={(scoreBoard) => {
                                        setScoreBoard(scoreBoard)
                                    }}
                                    setEndRoundInfo={(info) => {
                                        setEndRoundInfo(info)
                                        setCanPlayConfetti(true)
                                    }}
                                    playConfetti={() => {
                                        if (canPlayConfetti) {
                                            playConfetti()
                                        }
                                        setCanPlayConfetti(false)

                                    }}
                                    setAlert={(alertMessage) => {
                                        setAlertMessage(alertMessage)
                                    }}
                                    canPlayConfetti={canPlayConfetti}
                                    setRoundInfo={(message) => {
                                        setRoundInfo(message)
                                    }}
                                    setPaused={(message) => {
                                        setPaused(message)
                                    }}
                                    setSeek={(seek) => setSeek(seek)}
                                    paused={paused}
                />

            </div>
            <div className={"pub-score-board"}>
                <AlertComponent alert={alertMessage}/>
                <h1>Welcome to {pub.name} pub</h1>
                <h3>Score Board</h3>
                <span style={{
                    marginBottom: 10,
                    display: "block"
                }}>Round: {roundInfo.currentRound}/{roundInfo.maxRounds}</span>
                {(roundInfo.gameOver === true) ? <Podium scoreboard={scoreboard}/> : <></>}
                <br/>
                {score_board(scoreboard)}
                {(roundOver && song && artists) && <div>
                    <div className="song-info-block">
                        <div className="album-cover"
                             style={{backgroundImage: "url(" + endRoundInfo.albumCover + ")"}}></div>
                        <div className="song-details">
                            <h3 className="song-title">{song}</h3>
                            <p className="artists">{artists.toString()}</p>
                        </div>
                    </div>
                    <div className="progress-bar">
                        {parseInt(endRoundInfo.fastestGuess) < 30000 ? <>
                                <div className={"username"}><span style={{fontWeight: "bold"}}>User: <span
                                    style={{fontStyle: "italic", fontWeight: "normal"}}>{endRoundInfo.fastestGuesser}</span></span>
                                </div>
                                <div className={"progress-value"}><span style={{fontWeight: "bold"}}>Time: <span
                                    style={{fontStyle: "italic", fontWeight: "normal"}}>{endRoundInfo.fastestGuess}ms</span></span>
                                </div>
                            </>
                            : <>
                                <span>No correct guess yet!</span>
                            </>}

                    </div>
                </div>}

            </div>


        </div>

    </>)

}


function createConfettiSvg(color, explosionContainer) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "30");
    svg.style.position = "absolute";
    svg.style.left = `${Math.random() * 100}vw`; // Start around the center
    svg.style.transformOrigin = "center center";
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    const svgMarkup = "M 24.955 0.315 c 0.405 0.3 0.645 0.78 0.645 1.285 v 3.6 V 18.4 c 0 2.21 -2.15 4 -4.8 4 s -4.8 -1.79 -4.8 -4 s 2.15 -4 4.8 -4 c 0.56 0 1.1 0.08 1.6 0.23 V 7.35 L 9.6 11.19 V 21.6 c 0 2.21 -2.15 4 -4.8 4 s -4.8 -1.79 -4.8 -4 s 2.15 -4 4.8 -4 c 0.56 0 1.1 0.08 1.6 0.23 V 10 V 6.4 c 0 -0.705 0.465 -1.33 1.14 -1.535 l 16 -4.8 c 0.485 -0.145 1.01 -0.055 1.415 0.25 z"
    svgPath.setAttribute("d", svgMarkup);
    svgPath.setAttribute("fill", `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);

    svg.appendChild(svgPath);
    const rotation = (Math.random() - 0.5) * 360;
    explosionContainer.appendChild(svg);
    return svg;
}

function playConfetti() {

    const explosionContainer = document.getElementById("explosion-container");
    for (let i = 0; i < 100; i++) {
        const confetti = createConfettiSvg("rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")", explosionContainer);
        const animation = confetti.animate(
            [{transform: "translateY(0)", opacity: 1}, {transform: "translateY(100vh)", opacity: 0}],
            {duration: Math.random() * 3000 + 1000, fill: "forwards"}
        );
        animation.onfinish = () => {
            explosionContainer.removeChild(confetti);
        };
    }
}

function score_board(data) {
    data.sort((a, b) => b.points - a.points);

    return (
        <table className={"table-score-board"}>
            <thead>
            <tr>
                <th>Username</th>
                <th>Song</th>
                <th>Artist</th>
                <th>First</th>
                <th>Score</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    <td>{row.user}</td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512" className={`icon song-icon ${row.song ? 'green' : ''}`}>
                            <path
                                d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/>
                        </svg>
                    </td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className={`icon artist-icon ${row.artist ? 'green' : ''}`} viewBox="0 0 448 512">
                            <path
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                        </svg>
                    </td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512" className={`icon finish-icon ${row.first ? 'green' : ''}`}>
                            <path
                                d="M32 0C49.7 0 64 14.3 64 32V48l69-17.2c38.1-9.5 78.3-5.1 113.5 12.5c46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1V345.8c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4c-37.9-19-81.3-23.7-122.5-13.4L64 384v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V400 334 64 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9v65.5L64 252.6V318l48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3V238.7l38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9v66.7l-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8v71.4c21.8 1.9 43.3 6.7 64 14.4V244.2l22.7 6.7c13.5 4 27.3 6.4 41.3 7.4V194c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12v-62c-13-3.8-25.8-8.8-38.2-15c-8.2-4.1-16.9-7-25.8-8.8v72.4c-13-.4-26 .8-38.7 3.6L128 173.2V98L64 114v73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2V251.9l-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5v77.4zm64-149.4V115.4c-20.9 6.1-42.4 9.1-64 9.1V194c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z"/>
                        </svg>
                    </td>
                    <td>
                        {row.points}
                    </td>
                    <td>
                        {row.time}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}