import axios from "axios";
import { useState } from "react";
import Navbar from "./navigation.header";
import Checkbox from "./checkbox.component";
import { createPub } from "../actions/pub-actions";
import {
	addPlaylistSongsToSongList,
	generateRecommendations,
	searchArtistsOrTracks,
} from "../actions/spotify-actions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TrashIcon } from "lucide-react";

export default function CreatePubPage() {
	const [up, setUp] = useState(0);
	const [minPopularity, setMinPopularity] = useState(40);
	const [maxPopularity, setMaxPopularity] = useState(100);
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState("tp");
	const [maxMembers, setMaxMembers] = useState(6);
	const [teams, setTeams] = useState(false);
	const [artist, setArtist] = useState("");
	const [rounds, setRounds] = useState(10);
	const [track, setTrack] = useState("");
	const [playlist, setPlaylist] = useState("");
	const [showSongs, setShowSongs] = useState(false);
	const [selectedSeeds, setSelectedSeeds] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [trackList, setTrackList] = useState([]);
	const [searchType, setSearchType] = useState("playlist");
	let spotify = <span style={{ color: "#0F0" }}>Spotify Authorized</span>;
	let at = localStorage.getItem("access_token");
	if (at === null || at === undefined || at === "") {
		spotify = <a href={"/spotify/authorize"}>Authorize spotify</a>;
	}
	let searchResultsDisplay = <></>;
	if (searchResults.length > 0) {
		searchResultsDisplay = (
			<div className={"search-result-container"}>
				{searchResults.map((artist: any) => {
					return (
						<div
							className={"search-result"}
							onClick={(e) => {
								setSearchResults([]);
								setArtist("");
								if (artist.type === "playlist") {
									addPlaylistSongsToSongList(
										artist.href,
										setTrackList,
										trackList
									);
									return;
								}

								let selectedSeedsCopy: any = selectedSeeds;
								selectedSeedsCopy.push(artist);
								setSelectedSeeds(selectedSeedsCopy);
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-start",
									width: "100%",
								}}
							>
								<span key={artist.id}>{artist.name}</span>
								<span
									style={{
										display: artist.artist ? "inline-block" : "none",
										fontStyle: "italic",
									}}
								>
									{artist.artist}
								</span>
								<span
									style={{
										display: artist.tracks ? "inline-block" : "none",
										fontSize: 10,
									}}
								>
									Songs: {artist.tracks}
								</span>
							</div>
							<img
								style={{ maxWidth: 50, maxHeight: 50 }}
								src={artist.profile_picture}
							/>
						</div>
					);
				})}
			</div>
		);
	}
	let selectedArtistsDisplay;
	if (selectedSeeds.length > 0) {
		selectedArtistsDisplay = (
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					marginBottom: 10,
					marginTop: 10,
					flexWrap: "wrap",
				}}
			>
				{selectedSeeds.map((seed: any) => {
					return (
						<div
							key={seed.type === "genre" ? seed.name : seed.id}
							className={"seed-label"}
						>
							<span>
								{seed.type}: {seed.name}
							</span>

							<span
								onClick={() => {
									let selectedSeedsCopy = selectedSeeds;
									setSelectedSeeds(
										selectedSeedsCopy.filter((selSeed: any) => {
											return seed.name !== selSeed.name;
										})
									);
								}}
								style={{ color: "#F00", marginLeft: 5 }}
							>
								X
							</span>
						</div>
					);
				})}
			</div>
		);
	}
	let totalSongs = <span>{trackList.length}</span>;
	let searchBox;
	if (selectedSeeds.length < 5) {
		switch (searchType) {
			case "artist":
				searchBox = (
					<>
						<div className={"create-pub-input-row"} style={{ marginBottom: 0 }}>
							<input
								style={{
									borderRadius: searchResults.length > 0 ? "5px 5px 0 0" : "",
									width: "100%",
								}}
								id={"artist"}
								value={artist}
								onChange={(e) => {
									setArtist(e.target.value);
									if (e.target.value.length > 0 && e.target.value !== "")
										searchArtistsOrTracks(
											artist,
											"artist",
											setSearchResults
										);
									else setSearchResults([]);
								}}
							/>
						</div>
					</>
				);
				break;
			case "playlist":
				searchBox = (
					<>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								width: "100%",
								justifyContent: "space-between",
							}}
						>
							<input
								style={{
									borderRadius: searchResults.length > 0 ? "5px 5px 0 0" : "",
									width: "100%",
								}}
								id={"playlist"}
								value={playlist}
								onChange={(e) => {
									setPlaylist(e.target.value);
									if (e.target.value.length > 1 && e.target.value !== "")
										searchArtistsOrTracks(
											playlist,
											"playlist",
											setSearchResults
										);
									else setSearchResults([]);
								}}
							/>
						</div>
					</>
				);
				break;
			case "track":
				searchBox = (
					<>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								width: "100%",
								justifyContent: "space-between",
							}}
						>
							<input
								style={{
									borderRadius: searchResults.length > 0 ? "5px 5px 0 0" : "",
									width: "100%",
								}}
								id={"track"}
								value={track}
								onChange={(e) => {
									setTrack(e.target.value);
									if (e.target.value.length > 0 && e.target.value !== "")
										searchArtistsOrTracks(
											track,
											"track",
											setSearchResults
										);
									else setSearchResults([]);
								}}
							/>
						</div>
					</>
				);
				break;
			// case "genre":
			// 	searchBox = (
			// 		<div
			// 			style={{
			// 				display: "flex",
			// 				flexDirection: "row",
			// 				justifyContent: "space-between",
			// 				width: "100%",
			// 			}}
			// 		>
			// 			<select
			// 				value={selectedGenre}
			// 				onChange={(e) => {
			// 					setSelectedGenre(e.target.value);
			// 				}}
			// 			>
			// 				<option key={""} value={"empty"}></option>
			// 				{availableGenres
			// 					.filter((genre) => {
			// 						return !selectedSeeds
			// 							.map((seed: any) => seed.name)
			// 							.includes(genre);
			// 					})
			// 					.map((genre, i) => {
			// 						return (
			// 							<option key={i} value={genre}>
			// 								{genre.charAt(0).toUpperCase() + genre.slice(1)}
			// 							</option>
			// 						);
			// 					})}
			// 			</select>
			// 			{/* <button
			// 				className={"secondary-button"}
			// 				onClick={() => {
			// 					if (selectedGenre === "empty") return;
			// 					let selectedSeedsCopy: any = selectedSeeds;
			// 					selectedSeedsCopy.push({ name: selectedGenre, type: "genre" });
			// 					setSelectedSeeds(selectedSeedsCopy);
			// 					setSelectedGenre("empty");
			// 				}}
			// 			>
			// 				Add to Seed
			// 			</button> */}
			// 		</div>
			// 	);
		}
	}
	let generateRecommendationsButton;
	if (selectedSeeds.length > 0) {
		generateRecommendationsButton = (
			<div style={{ width: "100%", marginTop: 10 }}>
				<label>Popularity</label>
				<div className={"create-pub-input-row"}>
					<label>Min</label>
					<input
						id={"minPopularity"}
						value={minPopularity}
						min={0}
						max={maxPopularity - 1}
						type={"number"}
						onChange={(e) => setMinPopularity(parseInt(e.target.value))}
					/>
					<label>Max</label>

					<input
						id={"maxPopularity"}
						value={maxPopularity}
						min={minPopularity + 1}
						max={100}
						type={"number"}
						onChange={(e) => setMaxPopularity(parseInt(e.target.value))}
					/>
				</div>
				<button
					className={"main-button"}
					style={{ margin: 10 }}
					onClick={() =>
						generateRecommendations(
							selectedSeeds,
							setTrackList,
							trackList,
							minPopularity,
							maxPopularity
						)
					}
				>
					Generate Recommendations
				</button>
			</div>
		);
	}
	let shouldShowCreate = trackList.length < 20 && name !== "";
	return (
		<>
			<Navbar />
			<h1
				style={{
					marginLeft: "auto",
					marginRight: "auto",
					width: "fit-content",
				}}
			>
				Create your own Pub
			</h1>
			<div style={{
				width: "100%",
				maxWidth: 1100,
				marginLeft: "auto",
				marginRight: "auto",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 60,
			}}>
				<div style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "flex-start",
					justifyContent: "space-evenly",
					width: "100%",

				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: 300,
						alignItems: "flex-start",
					}}
				>
					<div className={"create-pub-input-row"}>
						<label htmlFor={"name"}>Name</label>
						<input
							id={"name"}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<span style={{ fontSize: 12 }}>
						Pub passwords are saved in plaintext use something random. Account
						passwords are properly encrypted but couldnt be bothered for the
						pubs
					</span>
					<div className={"create-pub-input-row"}>
						<label htmlFor={"password"}>Password</label>
						<input
							id={"password"}
								type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className={"create-pub-input-row"}>
						<label htmlFor={"maxMembers"}>Max Members</label>
						<input
							id={"maxMembers"}
							value={maxMembers}
							type={"number"}
							min={1}
							onChange={(e) => setMaxMembers(parseInt(e.target.value))}
						/>
					</div>
					<div className={"create-pub-input-row"}>
						<label htmlFor={"teams"}>Teams</label>
						<Checkbox
							onChange={(e) => setTeams(e.target.checked)}
							checked={teams}
						/>
					</div>
					<div className={"create-pub-input-row"}>
						<label htmlFor={"type"}>Type</label>
						<select
							id={"type"}
							defaultValue={type}
							onChange={(e) => setType(e.target.value)}
						>
							<option value={"tp"}>Typing Game</option>
							<option value={"mc"}>Multiple Choice Game</option>
						</select>
					</div>
					<div className={"create-pub-input-row"}>
						<label htmlFor={"rounds"}>Rounds</label>
						<input
							id={"rounds"}
							type={"number"}
							value={rounds}
							onChange={(e) => setRounds(parseInt(e.target.value))}
							min={1}
						/>
					</div>
					<button
						className={"main-button"}
						style={{
							display: trackList.length >= 20 ? "" : "none",
							width: "100%",
							marginTop: 20,
						}}
						onClick={() =>
							createPub({
								name: name,
								password: password,
								type: type,
								teams: teams,
								maxMembers: maxMembers,
								trackList: trackList,
								rounds: rounds,
							})
						}
					>
						Create
					</button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: 300,
						alignItems: "flex-start",
					}}
				>
						{/* <span>
						Selected Seeds{" "}
						<span
							style={{ color: selectedSeeds.length === 5 ? "#F00" : "#0F0" }}
						>
							{selectedSeeds.length}/5
						</span>
						:
					</span> */}
					{selectedArtistsDisplay}
					<br />
					<span>Total songs in list</span>
					{totalSongs}
					<br />

					<div
						style={{
							marginBottom: 5,
							display: selectedSeeds.length < 5 ? "flex" : "none",
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<label htmlFor={"searchType"}>Search Type</label>
						<select
							id={"searchType"}
							defaultValue={searchType}
							onChange={(e) => setSearchType(e.target.value)}
						>
							<option key={"artist"} value={"artist"}>
								Artist
							</option>
							<option key={"track"} value={"track"}>
								Track
							</option>
							<option key={"playlist"} value={"playlist"}>
								Playlist
							</option>
								{/* <option key={"genre"} value={"genre"}>
								Genre
							</option> */}
						</select>
					</div>

					{searchBox}
					{searchResultsDisplay}
					{generateRecommendationsButton}
					<br />
					<span
						style={{ display: shouldShowCreate ? "" : "none", fontSize: 12 }}
					>
						Make sure that there are atleast 20 songs in the tracklist
					</span>
				</div>

				</div>
				<button
					className={"main-button"}
					style={{ width: 200, marginTop: 20 }}
					onClick={() => {
						setShowSongs(!showSongs);
					}}
				>
					{showSongs ? "Hide Songs" : "Show Songs"}
				</button>
				{showSongs && trackList.length > 0 && <Table style={{ width: "60vw" }}>
					<TableCaption>A list of your added songs.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Album</TableHead>
							<TableHead>Remove</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{trackList.map((track: any) => {
							let artist = track.artists.join(" & ");
							if (track.artists.length > 1) {
								artist = track.artists
									.map((artist: any) => artist.name)
									.join(" & ");
							} else if (track.artists.length === 1) {
								artist = track.artists[0].name;
							} else {
								artist = "Unknown Artist";
							}
							return (
								<TableRow key={track.id}>
									<TableCell>
										{track.name.length > 50
											? track.name.substring(0, 50) + "..."
											: track.name}
									</TableCell>
									<TableCell>
										{artist}
									</TableCell>
									<TableCell>
										{track.albumCover && track.albumCover.url ? (
											<img
												src={track.albumCover.url}
												alt={"No image"}
												style={{ maxWidth: 50, maxHeight: 50 }}
											/>
										) : (
											<span>No image</span>
										)}
									</TableCell>
									<TableCell>
										<button
											className={"secondary-button"}
											onClick={() => {
												let trackListCopy = trackList;
												trackListCopy = trackListCopy.filter(
													(t: any) => t.id !== track.id
												);
												setTrackList(trackListCopy);
											}}
										>
											<TrashIcon />
										</button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>}
			</div>
		</>
	);
}
