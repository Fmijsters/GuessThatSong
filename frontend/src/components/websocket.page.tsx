import {Component} from 'react';


interface socketProps {
    pubId: any,
    randomString: any,
    setTime: (message) => void,
    setRoundOver: (message) => void,
    setSong: (message) => void,
    setArtists: (message) => void,
    setPreviewUrl: (message) => void,
    setScoreBoard: (message) => void,
    setEndRoundInfo: (message) => void,
    playConfetti: () => void,
    setAlert: (message) => void,
    canPlayConfetti: boolean,
    setRoundInfo: (message) => void,
    setPaused: (message) => void,
    setSeek: (message) => void,
    paused: boolean,
    setCallback: (message) => void
}

interface socketState {
    messageInput: string,
    socket: any,
    shouldConfetti: boolean,
    paused: boolean,
}

class WebSocketComponent extends Component<socketProps, socketState> {

    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
        const {
            pubId,
            setTime,
            setRoundOver,
            setSong,
            setArtists,
            setPreviewUrl,
            setScoreBoard,
            setEndRoundInfo,
            playConfetti,
            setAlert,
            setRoundInfo,
            setPaused,
            paused,
            setCallback
        } = this.props;

        const socket = new WebSocket('ws://192.168.0.104:8000/ws/' + this.props.randomString + '/' + +pubId + '/');

        socket.onopen = () => {
            console.log('WebSocket connection opened', this.props.randomString);
            socket.send(JSON.stringify({
                'message': localStorage.getItem("authToken"),
                'type': "identify"
            }));
        };
        socket.onerror = (e) => {
            console.log(e)
        }

        socket.onmessage = (event) => {
            if (this.state.socket.readyState !== socket.readyState) {
                this.setState({socket: socket})
            }

            const messageData = JSON.parse(event.data);
            if (messageData.type !== "game_update")
                console.log(messageData)
            if (messageData.type === "game_update") {
                setTime(parseInt(messageData.message));
                setRoundOver(messageData.round_over === "True");
            } else if (messageData.type === "round_info") {
                setRoundInfo({
                    currentRound: messageData.current_round,
                    maxRounds: messageData.max_rounds,
                    gameOver: messageData.game_over
                })
            } else if (messageData.type === "new_song") {
                setSong(messageData.song);
                setPreviewUrl(messageData.preview_url);
                setArtists(messageData.artists);
            } else if (messageData.type === "correct_guess") {
                if (parseInt(localStorage.getItem('userId')) === parseInt(messageData.userId)) {
                    setSong(messageData.song);
                    setArtists(messageData.artists);
                }
            } else if (messageData.type === "end_round") {
                this.setState({shouldConfetti: true})
                setSong(messageData.song);
                setArtists(messageData.artists);
                setEndRoundInfo({
                    albumCover: messageData.album_cover,
                    fastestGuesser: messageData.fastest_guesser,
                    fastestGuess: messageData.fastest_guess,

                })
                setRoundInfo({
                    currentRound: messageData.current_round,
                    maxRounds: messageData.max_rounds,
                    gameOver: messageData.game_over
                })
            } else if (messageData.type === "update_points") {
                setScoreBoard(messageData.score_board);
                for (const item of messageData.score_board) {
                    if (item.user === localStorage.getItem("username") && item.first === true && item.confetti) {
                        playConfetti()
                    }
                }
            } else if (messageData.type === "status_update") {
                setAlert({status: messageData.status, text: messageData.text})
            } else if (messageData.type === "update_pause") {
                this.setState({paused: messageData.paused})
                this.props.setPaused(messageData.paused)
            } else if (messageData.type === "seek_to_song" && parseInt(messageData.user_id) === parseInt(localStorage.getItem("userId"))) {
                setPreviewUrl(messageData.preview_url)
                setTime(messageData.time)
                this.setState({paused: messageData.paused})
                this.props.setPaused(messageData.paused)

            }
        };
        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', this.props.randomString, event.code, event.reason);
        };
        this.state = {
            messageInput: '',
            socket: socket,
            shouldConfetti: true,
            paused: false,
        };
    }

    componentWillUnmount() {
        if (this.state.socket) {
            this.state.socket.close();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.submit();
        }
    }

    submit() {
        const {messageInput} = this.state;
        const {socket} = this.state;
        if (socket) {
            socket.send(JSON.stringify({
                'message': messageInput,
                'type': "guess"
            }));
            this.setState({messageInput: ''});
        }
    }

    componentWillReceiveProps(nextProps: Readonly<socketProps>, nextContext: any) {
        this.setState({paused: nextProps.paused})
    }

    render() {
        const {messageInput, paused} = this.state;
        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>

                <input
                    onKeyPress={this.handleKeyPress}
                    id="message"
                    value={messageInput}
                    onChange={(e) => this.setState({messageInput: e.target.value})}
                />
                {paused ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={30} height={30}
                               style={{fill: "#DDDDDD"}} onClick={() => {
                        this.state.socket.send(JSON.stringify({
                            'message': !paused,
                            'type': "pause"
                        }));
                        this.setState({paused: !paused})
                        this.props.setPaused(!paused)

                    }}>
                        <path
                            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 320 512"
                         style={{fill: "#DDDDDD"}} onClick={() => {
                        this.state.socket.send(JSON.stringify({
                            'message': !paused,
                            'type': "pause"
                        }));
                        this.setState({paused: !paused})
                        this.props.setPaused(!paused)
                    }}>
                        <path
                            d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
                    </svg>}
            </div>
        );
    }
}

export default WebSocketComponent;
