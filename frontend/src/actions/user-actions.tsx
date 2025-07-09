import axios from "axios";
import { GTSApiClient } from "./axios-instance";

export const createUser = async (user) => {
    if (user.password !== user.password2 || !user.password || !user.password2 || !user.username) {
        return
    }

    const apiUrl = process.env.REACT_APP_BACKEND_URL + '/api/users/create';
    let response = await axios.post(apiUrl, user)
    console.log(response.data)
    if (response.data.id) {
        window.location.href = "/login"
        localStorage.setItem("username", user.username)
        localStorage.setItem("userId", response.data.id)

    }
}

export const handleLogin = async (username, password, setError) => {
    try {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + '/api/users/login';
        let response = await axios
            .post(apiUrl, { username, password })
        if (response.status !== 200) {
            setError('Login failed');
            return
        }
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);

        window.location.href = '/';
    }
    catch (error) {
        console.error('Login failed:', error);
        setError('Invalid credentials');
    }

};