const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const PORT = 3500
const app = express()
app.use(cors())

const videos = [
    {
        id: 0,
        poster: '/video/0/poster',
        duration: '30 sec',
        name: 'Sample 1'
    },
    {
        id: 1,
        poster: '/video/0/poster',
        duration: '42 sec',
        name: 'Sample 2'
    },
    {
        id: 2,
        poster: '/video/0/poster',
        duration: '45 sec',
        name: 'Sample 3'
    },
]

app.get('/', (req, res) => {
    res.sendFile('assets/sample.mp4', { root: __dirname })
})

// video route
app.get('/video', (req, res) => {
    res.json(videos)
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})