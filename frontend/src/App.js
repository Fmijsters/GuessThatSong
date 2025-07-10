import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/home.page";
import LoginPage from "./components/login.page";
import PubPage from "./components/pub.page";
import AuthorizeSpotifyPage from "./components/authorizespotify.page";
import CreatePubPage from "./components/createpub.page";
import CreateUserPage from "./components/createuser.page";
import LeaderboardPage from "./components/leaderboard.page";
import { GTSApiClient } from "./actions/axios-instance";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

function App() {
	const [error, setError] = useState("");
	useEffect(() => {
		GTSApiClient.interceptors.response.use(
			function (response) {
				if (
					response &&
					response.data &&
					response.data.hasOwnProperty("error")
				) {
					toast(response.data.error);
					setError(response.data.error);
				} else {
					return response;
				}
			},
			function (error) {
				if (error.response?.status === 401) {
					window.location.href = "/login?ref=" + window.location.pathname;
				} else {
					console.log(error);
					if (error?.response?.data?.error) {
						setError(
							`${error.response.data.error} (${error.response?.status})`
						);
					} else {
						setError(
							`Er is iets misgegaan probeer het later opnieuw (${error.response?.status})`
						);
					}
				}
				// return Promise.reject(error)
			}
		);
	}, [setError]);
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route exact path="/pub/:pubId" element={<PubPage />} />
				<Route
					exact
					path="/spotify/authorize"
					element={<AuthorizeSpotifyPage />}
				/>
				<Route exact path={"/createpub"} element={<CreatePubPage />} />
				<Route exact path={"/leaderboard"} element={<LeaderboardPage />} />
				<Route exact path={"/createuser"} element={<CreateUserPage />} />
				<Route exact path="/login" element={<LoginPage />} />
			</Routes>
			<Toaster />
		</Router>
	);
}

export default App;
