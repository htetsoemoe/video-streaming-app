const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const thumbsupply = require('thumbsupply')

const PORT = 3500
const app = express()
app.use(cors())

const videos = [
    {
        id: 0,
        poster: '/video/1/poster',
        duration: '3 mins',
        name: 'Final Fantasy XVI - Salvation Launch Trailer'
    },
    {
        id: 1,
        poster: '/video/2/poster',
        duration: '1:35 mins',
        name: 'The Mandalorian: Official Trailer'
    },
    {
        id: 2,
        poster: '/video/3/poster',
        duration: '1:48 mins',
        name: 'The Book of Boba Fett: Official Trailer '
    },
    {
        id: 3,
        poster: '/video/4/poster',
        duration: '3 mins',
        name: 'Warhammer: Official Trailer'
    }
]

app.get('/', (req, res) => {
    res.sendFile('assets/sample.mp4', { root: __dirname })
})

// video route
app.get('/video', (req, res) => {
    res.json(videos)
})

// endpoint to fetch a single video's metadata
app.get('/video/:id/data', (req, res) => {
    let id = parseInt(req.params.id, 10)
    res.json(videos[id])
})

// Generate thumbnail of video
app.get('/video/:id/poster', (req, res) => {
    thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`) // Need to change req.params.id to uploaded video name
        .then(thumb => res.sendFile(thumb))
        .catch(err => console.log(err))
})

// Caption route for Track element of Player.jsx
app.get('/video/:id/caption', (req, res) => {
    res.sendFile('assets/captions/sample.vtt', { root: __dirname })
})

// Get a single video (video streaming route)
app.get('/video/:id', (req, res) => {
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path); // fs.statSync(path) → Retrieves file metadata, including size.
    const fileSize = stat.size;

    /**
     * Range headers allow users to request specific parts of a file.
     * If range exists, the browser is likely requesting a specific portion of the video (e.g., seeking in a media player).
     */
    const range = req.headers.range;
    console.log(`Range: ${range}`)

    /**
     * Extracts the requested range from the header (e.g., "bytes=1000-" means "start at byte 1000").
     * start → Start byte position.
     * end → End byte position (if not provided, use the last byte).
     * fs.createReadStream(path, { start, end }) → Streams only the requested portion of the file.
     */
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end }); // fs.createReadStream(path, { start, end }) → Streams only the requested portion of the file.
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`, // Content-Range: Specifies which bytes are being sent.
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head); // 206 for partial content
        file.pipe(res); // The file stream is piped to the response (file.pipe(res)), efficiently sending only the requested portion.
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})