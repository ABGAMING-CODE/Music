const audioPlayer = document.getElementById('audioPlayer');
const lyricsContainer = document.getElementById('lyrics');
let lyrics = [];

// Fetch the lyrics file from Google Drive
fetch('https://drive.google.com/uc?export=download&id=YOUR_LRC_FILE_ID')
    .then(response => response.text())
    .then(text => {
        // Parse lyrics
        lyrics = text.split('\n').map(line => {
            const match = line.match(/(\d+):(\d+\.\d+)(.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const time = minutes * 60 + seconds;
                return { time, text: match[3].trim() };
            }
        }).filter(line => line); // Remove any undefined lines
    });

// Update lyrics as the song plays
audioPlayer.ontimeupdate = () => {
    const currentTime = audioPlayer.currentTime;
    const currentLyric = lyrics.find((lyric, i) =>
        currentTime >= lyric.time && (!lyrics[i + 1] || currentTime < lyrics[i + 1].time)
    );

    if (currentLyric) {
        lyricsContainer.innerHTML = lyrics.map(lyric =>
            `<div class="${lyric === currentLyric ? 'highlight' : ''}">${lyric.text}</div>`
        ).join('');
    }
};
