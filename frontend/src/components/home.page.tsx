import {useEffect, useState} from 'react';
import axios from 'axios';
import "./pages.css";
import Navbar from "./navigation.header";

function getPubs(setPubs) {
    const apiUrl = 'http://192.168.0.104:8000/api/pubs';

    axios.get(apiUrl)
        .then(response => {
            setPubs(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function checkPasswordCorrect(pubId, password) {
    const apiUrl = 'http://192.168.0.104:8000/api/pubs/join';
    const authToken = localStorage.getItem('authToken');
    let headers = {headers: {Authorization: "Token " + localStorage.getItem('authToken')}}
    axios.post(apiUrl, {
        id: pubId,
        password: password,
    }, headers)
        .then(response => {
            console.log('Response headers:', response.headers);
            console.log(response.data.isAuthenticated)
            if (response.data.isAuthenticated == true) {
                window.location.href = '/pub/' + pubId
                localStorage.setItem('userId', response.data.userId)

            } else {
                window.alert("Wrong password buddy!")
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            window.location.href = "/login"
        });
}

function HomePage() {
    const [pubs, setPubs] = useState([]);

    useEffect(() => {
        getPubs(setPubs);
    }, []);
    return (
        <div style={{height: "100%"}}>
            <Navbar/>
            <div style={{padding: 40, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h1>Guess that song baby!</h1>
                <div className={"table-container"}>
                    {displayPubs(pubs)}
                    <button style={{width: 200, marginTop: 20}} className={"main-button"}
                            onClick={() => window.location.href = "/createpub"}>Create your
                        own <span
                            style={{fontWeight: "bold"}}>Pub</span>!
                    </button>
                </div>
            </div>
        </div>
    );
}

function deletePub(id) {
    const apiUrl = 'http://192.168.0.104:8000/api/pubs/delete';
    axios.post(apiUrl, {id: id}, {headers: {Authorization: "Token " + localStorage.getItem('authToken')}})
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            window.location.href = "/login"
        });
}

function displayPubs(pubs) {
    if (!pubs.length) {
        return <span style={{marginTop: 40, marginBottom: 40}}>There are no pubs</span>;
    }

    return (
        <table className="pub-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Game Type</th>
                <th>Teams</th>
                <th>Members</th>
                <th>Rounds</th>
                <th style={{textAlign: "right"}}>Join Status</th>
                <th style={{float: "right"}}>Owner</th>
            </tr>
            </thead>
            <tbody>
            {pubs.map(pub => (
                <tr key={pub.name}>
                    <td>{pub.name}</td>
                    <td>{pub.game_type}</td>
                    <td>{pub.teams ? "Yes" : "No"}</td>
                    <td style={{color: pub.member_count === pub.max_members ? "#F00" : "#0F0"}}>{pub.member_count} / {pub.max_members}</td>
                    <td>{pub.rounds}</td>
                    <td>
                        <button style={{float: "right"}}
                                className={"secondary-button" + (pub.member_count < pub.max_members ? "" : " disabled")}
                                onClick={() => {
                                    if (pub.member_count >= pub.max_members) return
                                    let input = window.prompt("Password please")
                                    checkPasswordCorrect(pub.id, input)
                                }}>{pub.member_count < pub.max_members ? "Join" : "Full"}</button>
                    </td>
                    <td>{pub.owner === localStorage.getItem("username") ?
                        <button style={{float: "right"}} onClick={() => deletePub(pub.id)}
                                className={"secondary-button disabled"}>Delete</button> : <></>}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default HomePage;
