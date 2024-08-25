import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const Home = () => {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('http://localhost:3500/video')
                const data = await res.json()
                // console.log(data)
                setVideos(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchVideos()
    }, [])
    console.log(videos)

    return (
        <div className='w-[90%] mx-auto my-10'>
            <Header />
            <div className='mt-10 p-10 bg-slate-600'>
                <div className="grid grid-cols-3 gap-3">
                    {
                        videos.map((video) => (
                            <div className="p-5 bg-yellow-300" key={video.id}>
                                <Link to={`/player/${video.id}`}>
                                    <div className="">
                                        <img src={`http://localhost:3500${video.poster}`} alt={video.name} />
                                        <div className="">
                                            <p className="">{video.name}</p>
                                            <p className="">{video.duration}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Home
