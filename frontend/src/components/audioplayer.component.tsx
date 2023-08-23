// ... (your imports and other code)

import {useEffect, useRef, useState} from "react";

function CustomAudioPlayer({audioUrl, paused, seek}) {
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.load(); // Load the audio source
        }
    }, [audioUrl]);

    useEffect(() => {
        if (audioRef.current && seek && audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.load(); // Load the audio source
            audioRef.current.currentTime = 30 - parseFloat(seek)
        }
    }, [seek]);
    //
    // if (audioRef.current) {
    //     console.log(audioRef.current.currentTime)
    // }

    useEffect(() => {
        if (!audioRef.current || !audioUrl) return;

        if (!paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [paused]);


    return (
        <div className="custom-audio">
            <audio ref={audioRef} onLoadedData={() => {
                if (!paused) audioRef.current.play();
            }}>
                <source src={audioUrl} type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>
            <div className="volume-control">
                <input
                    style={{padding: 0, marginTop: 40, display: audioUrl ? "" : "none"}}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
}

export default CustomAudioPlayer;
