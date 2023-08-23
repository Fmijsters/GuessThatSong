import axios from "axios";
import {useState} from "react";
import Navbar from "./navigation.header";
import Checkbox from "./checkbox.component";

function createUser(user) {
    if (user.password !== user.password2 || !user.password || !user.password2 || !user.username) {
        return
    }

    const apiUrl = 'http://192.168.0.104:8000/api/users/create';
    axios.post(apiUrl, user)
        .then(response => {
            console.log(response.data)
            if (response.data.id) {
                window.location.href = "/"
                localStorage.setItem("username", user.username)
                localStorage.setItem("userId", response.data.id)
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

export default function CreateUserPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    return (<>

        <Navbar/>
        <h1 style={{marginLeft: "auto", marginRight: "auto", width: "fit-content"}}>Create user</h1>

        <div className="login-input-container">
            <span>No spaces please</span>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Repeat Password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
            />
            <button className={"main-button"}
                    onClick={() => {
                        // console.log({
                        //     username: username,
                        //     password: password,
                        //     password2: password2
                        // })
                        createUser(
                            {
                                username: username,
                                password: password,
                                password2: password2
                            }
                        )
                    }}>Create
            </button>
        </div>

    </>)
}

