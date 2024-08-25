import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'

const Player = () => {
  const { id } = useParams()
  const [videoData, setVideoData] = useState({})

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const res = await fetch(`http://localhost:3500/video/${id}`)
        const data = await res.json();
        setVideoData(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchVideoData()
  }, [id])

  return (
    <div className='w-[90%] mx-auto my-10'>
      <Header />
      <div className="mt-10 p-10 bg-slate-600">
        <video 
          controls muted autoPlay crossOrigin='anonymous'
          className='w-[70%] mx-auto'
        >
          <source src={`http://localhost:3500/video/${id}`} type="video/mp4"></source>
          <track label="English" kind="captions" srcLang="en" src={`http://localhost:4000/video/${id}/caption`} default></track>
        </video>
      </div>
      <Footer />
    </div>
  )
}

export default Player
