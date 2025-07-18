import { useState } from 'react';
import axios from 'axios';
import Navbar from './navigation.header';
import './login.css'; // Import your CSS styles for the login page
import { handleLogin } from '../actions/user-actions';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');



    return (
        <>            <Navbar />

            <div className="login-page">
                <div className="login-content">
                    <h1>Login</h1>
                    <div className="login-input-container">
                        <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={async (e) => {
                            e.preventDefault();
                            handleLogin(username, password, setError)

                        }}>
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
                        <div style={{ display: "flex", flexDirection: "column" }}>

                                <button className="main-button" type="submit">
                                Login
                            </button>
                            </div>
                        </form>


                        <button className="secondary-button" style={{ marginTop: 10 }} onClick={() => {
                                window.location.href = "/createuser"
                            }}>
                                Create account
                        </button>
                    </div>
                    {error && <div className="error-popup">{error}</div>}
                </div>
            </div>
        </>
    );
}

export default LoginPage;
