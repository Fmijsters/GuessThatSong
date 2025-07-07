import axios from "axios";
import {useState} from "react";
import Navbar from "./navigation.header";
import Checkbox from "./checkbox.component";
import { createUser } from "../actions/user-actions";



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

