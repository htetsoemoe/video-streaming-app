import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
    // console.log(videos)

    return (
        <div className='w-[90%] mx-auto my-10'>
            <Header />
            <div className='mt-10 p-10 bg-slate-600'>
                <div className="grid grid-cols-3 gap-7">
                    {
                        videos.map((video) => (
                            <div className="p-5 bg-[#9cc0c0] rounded-md" key={video.id}>
                                <Link to={`/player/${video.id}`}>
                                    <div className="">
                                        <img src={`http://localhost:3500/video/${video.id}/poster`} alt={video.name} /> {/* Generate a thumbnail of the video */}
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
            <Footer />
        </div>
    )
}

export default Home
