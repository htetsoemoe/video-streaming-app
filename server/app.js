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
        duration: '30 sec',
        name: 'Green: Raining on Sunday'
    },
    {
        id: 1,
        poster: '/video/2/poster',
        duration: '42 sec',
        name: 'Water Tank: Raining on Sunday'
    },
    {
        id: 2,
        poster: '/video/3/poster',
        duration: '45 sec',
        name: 'Tree: Raining on Sunday'
    },
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
    thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
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
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log(`Range: ${range}`)

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
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