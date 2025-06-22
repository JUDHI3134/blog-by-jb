import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='h-10 w-10 rounded-full animate-spin border-4 border-t-white border-gray-700'></div>
    </div>
  )
}

export default Loader
