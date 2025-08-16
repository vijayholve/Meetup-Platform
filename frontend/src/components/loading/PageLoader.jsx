import React from 'react'

const PageLoader = ({reason}) => {
  return (
    <>
     (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-700 text-lg font-semibold">Loading {reason}</p>
      </div>
    </div>
  )
    </>
  )
}

export default PageLoader