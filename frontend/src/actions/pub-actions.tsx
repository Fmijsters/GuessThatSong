import { GTSApiClient } from "./axios-instance";

export const createPub = async (pub: {
	name: string;
	password: string;
	type: string;
	teams: boolean;
	maxMembers: number;
	trackList: any[];
	rounds: number;
}) => {
	const apiUrl = process.env.REACT_APP_BACKEND_URL + "/api/pubs/createpub";
	let response = await GTSApiClient.post(apiUrl, pub);
	if (response.data.id) window.location.href = "/pub/" + response.data.id;
};

export const getPubs = async (setPubs) => {
	const apiUrl = process.env.REACT_APP_BACKEND_URL + "/api/pubs";

	let response = await GTSApiClient.get(apiUrl);
	setPubs(response.data);
	if (response.status !== 200) {
		console.error("Error fetching pubs:", response);
		window.location.href = "/login";
	}
};

export const deletePub = async (id) => {
	const apiUrl = process.env.REACT_APP_BACKEND_URL + "/api/pubs/delete";
	let response = await GTSApiClient.post(apiUrl, { id });
	if (response.status !== 200) {
		console.error("Error fetching pubs:", response);
		window.location.href = "/login";
	}
	window.location.reload();
};

export const checkPasswordCorrect = async (pubId, password) => {
	const apiUrl = process.env.REACT_APP_BACKEND_URL + "/api/pubs/join";
	let response = await GTSApiClient.post(apiUrl, {
		id: pubId,
		password: password,
	});
	if (response.status !== 200) {
		console.error("Error joining pub:", response);
		window.location.href = "/login";
	}
	if (response.data.isAuthenticated == true) {
		window.location.href = "/pub/" + pubId;
		localStorage.setItem("userId", response.data.userId);
	} else {
		window.alert("Wrong password buddy!");
	}
};
