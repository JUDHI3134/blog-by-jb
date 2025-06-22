import React from 'react'

const NewsLetter = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='text-2xl md:text-4xl font-semibold'>Never Miss a Blog</h1>
          <p className='md:text-lg pb-8 text-gray-500/70'>Subscribe to get the latest blog, new texh and exclusive news.</p>
          <form className='flex items-center justify-between max-w-2xl w-full h-12 md:h-13'>
              <input className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500' type="text" placeholder='Enter your Email id' required />
              <button type="submit" className='px-8 md:px-12 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none'>Subscribe</button>
          </form>
    </div>
  )
}

export default NewsLetter
