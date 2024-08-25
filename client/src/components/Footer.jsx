import React from 'react'

const Footer = () => {
    return (
        <div>
            <p className='text-center font-semibold p-5 bg-slate-400 mt-44'>
                &copy; {new Date().getFullYear()}, All rights reversed.
            </p>
        </div>
    )
}

export default Footer
