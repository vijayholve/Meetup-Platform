
import React from 'react'

const Errors = ({errorMsg}) => {
  return (
    {errorMsg.length > 0 && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
          <ul className="list-disc pl-5">
            {errorMsg.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
  )
}

export default Errors