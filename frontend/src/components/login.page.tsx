import {useState} from 'react';
import axios from 'axios';
import Navbar from './navigation.header';
import './login.css'; // Import your CSS styles for the login page

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        axios
            .post('http://192.168.0.104:8000/api/users/login', {username, password})
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', username);
                window.location.href = '/';
            })
            .catch(error => {
                console.log(error.message);
                setError('Invalid credentials');
            });
    };

    return (
        <>            <Navbar/>

            <div className="login-page">
                <div className="login-content">
                    <h1>Login</h1>
                    <div className="login-input-container">
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
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <button className="main-button" onClick={handleLogin}>
                                Login
                            </button>
                            <button className="secondary-button" style={{marginTop: 10}} onClick={() => {
                                window.location.href = "/createuser"
                            }}>
                                Create account
                            </button>
                        </div>
                    </div>
                    {error && <div className="error-popup">{error}</div>}
                </div>
            </div>
        </>
    );
}

export default LoginPage;
