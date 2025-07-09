import Navbar from "./navigation.header";
import {useEffect, useState} from "react";
import axios from "axios";
import { getRecords, getTimeRecords } from "../actions/leaderboard-actions";



export default function LeaderboardPage() {
    const [records, setRecords] = useState([])
    const [timeRecords, setTimeRecords] = useState([])

    useEffect(() => {
        getRecords(setRecords);
        getTimeRecords(setTimeRecords)
    }, []);
    return (
        <div>
            <Navbar/>
            <div style={{padding: 40, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h1>Leaderboard</h1>
                <div className={"table-container"}>
                    <h3>Total records</h3>
                    {displayRecords(records)}
                    <br/>
                    <h3>Fastest guesses</h3>
                    {displayFastestRecords(timeRecords)}
                </div>
            </div>

        </div>
    )
}

function displayRecords(records) {
    if (!records.length) {
        return <span style={{marginTop: 40, marginBottom: 40}}>There are no records</span>;
    }

    return (
        <table className="pub-table" style={{borderRadius: 5, border: "1px solid #FFC107", padding: 10}}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Records</th>
            </tr>
            </thead>
            <tbody>
            {records.map(record => (
                <tr key={record.name}>
                    <td>{record.username}</td>
                    <td>{record.records}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function displayFastestRecords(timeRecords) {
    if (!timeRecords.length) {
        return <span style={{marginTop: 40, marginBottom: 40}}>There are no records</span>;
    }
    console.log(timeRecords)

    return (
        <table className="pub-table" style={{borderRadius: 5, border: "1px solid #FFC107", padding: 10}}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Song</th>
                <th>Artist</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {timeRecords.map(record => (
                <tr key={record.username}>
                    <td>{record.username}</td>
                    <td style={{maxWidth: 300, display: "block"}}>{record.song}</td>
                    <td style={{}}>{record.artist}</td>
                    <td>{record.time}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
