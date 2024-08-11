import React from 'react'
import Home from './pages/Home'

const App = () => {
  return (
    <div className='w-[90%] mx-auto my-10'>
      <h1 className="text-4xl text-center p-5 bg-slate-400">Video Streaming Application</h1>

      <div className="">
        <Home />
      </div>
    </div>
  )
}

export default App
