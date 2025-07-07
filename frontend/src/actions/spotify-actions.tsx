import { SpotifyApiClient } from "./axios-instance";

export const searchArtistsOrTracks = async (
	query,
	type,
	searchTerm,
	setSearchResults
) => {
	let apiUrl = "https://api.spotify.com/v1/search";
	let response = await SpotifyApiClient.get(apiUrl, {
		params: { q: query, type: type, limit: 20 },
	});
	let searchResults: any = response;
	let results = searchResults.data[`${type}s`].items.map((result) => {
		if (type === "track")
			return {
				name: result.name,
				id: result.id,
				type: type,
				artist: result.artists.map((artist) => artist.name).join(" & "),
				profile_picture:
					result.album.images.length > 0 ? result.album.images[0].url : "",
			};
		else if (type === "playlist") {
			return {
				name: result.name,
				id: result.id,
				type: type,
				artist: result.owner.display_name,
				profile_picture: result.images.length > 0 ? result.images[0].url : "",
				href: result.tracks.href,
				tracks: result.tracks.total,
			};
		}
		return {
			name: result.name,
			id: result.id,
			type: type,
			profile_picture: result.images.length > 0 ? result.images[0].url : "",
		};
	});
	setSearchResults(results);
};

export const generateRecommendations = async (
	selectedSeeds,
	setTrackList,
	tracklist,
	minPopularity,
	maxPopularity
) => {
	const apiUrl = "https://api.spotify.com/v1/recommendations";
	let artists: any[] = [];
	let tracks: any[] = [];
	let genres: any[] = [];
	selectedSeeds.forEach((seed: any) => {
		switch (seed.type) {
			case "artist":
				artists.push(seed.id);
				break;
			case "track":
				tracks.push(seed.id);
				break;
			case "genre":
				genres.push(seed.name);
				break;
		}
	});
	try {
		let searchResults = await SpotifyApiClient.get(apiUrl, {
			params: {
				limit: 100,
				seed_artists: artists.toString(),
				seed_tracks: tracks.toString(),
				seed_genres: genres.toString(),
				min_popularity: minPopularity,
				max_popularity: maxPopularity,
			},
		});

		let newTrackList: any[] = [];
		searchResults.data.tracks.forEach((searchResult, i) => {
			if (searchResult.preview_url) {
				let albumCover;
				if (searchResult.album.images.length > 0) {
					albumCover = searchResult.album.images[0];
				}
				let track = {
					albumCover: albumCover,
					name: searchResult.name,
					artists: [] as any[],
					previewUrl: searchResult.preview_url,
					id: searchResult.id,
				};
				searchResult.artists.forEach((artist) => {
					track.artists.push({ name: artist.name, id: artist.id });
				});
				newTrackList.push(track);
			}
		});
		const finalTrackList: any[] = [];
		finalTrackList.concat(newTrackList);
		for (const track of tracklist) {
			let found = false;
			for (const track2 of finalTrackList) {
				if (track2.name === track.name) {
					console.log("Duplicate", track2, track);
					found = true;
					break;
				}
			}
			if (!found) {
				finalTrackList.push(track);
			}
		}
		setTrackList(finalTrackList);
	} catch (error: any) {
		console.log(error);

		if (error.response && error.response.status === 401) {
			window.location.href = "/spotify/authorize";
		} else if (error.response) {
			console.error("Error fetching recommendations:", error.response.data);
		} else {
			console.error("Unexpected error:", error);
		}
	}
};
export const addPlaylistSongsToSongList = async (
	href: string,
	setTrackList: any,
	tracklist: any[]
) => {
	let response = await SpotifyApiClient.get(href, {
		params: { limit: 100 },
	});

	let newTrackList: any[] = [];
	response.data.items.forEach((item: any) => {
		const searchResult = item.track;
		if (searchResult && searchResult.preview_url) {
			let albumCover;
			if (searchResult.album.images.length > 0) {
				albumCover = searchResult.album.images[0];
			}
			let track = {
				albumCover: albumCover,
				name: searchResult.name,
				artists: searchResult.artists.map((artist: any) => ({
					name: artist.name,
					id: artist.id,
				})),
				previewUrl: searchResult.preview_url,
				id: searchResult.id,
			};
			newTrackList.push(track);
		}
	});

	const finalTrackList: any[] = [];
	finalTrackList.push(...newTrackList);
	for (const track of tracklist) {
		let found = false;
		for (const track2 of finalTrackList) {
			if (track2.name === track.name) {
				found = true;
				break;
			}
		}
		if (!found) {
			finalTrackList.push(track);
		}
	}
	setTrackList(finalTrackList);

	if (response.data.next) {
		await addPlaylistSongsToSongList(
			response.data.next,
			setTrackList,
			finalTrackList
		);
	}
};
