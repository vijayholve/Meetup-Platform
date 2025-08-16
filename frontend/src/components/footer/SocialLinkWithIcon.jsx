import React from 'react'

const SocialLinkWithIcon = ({title,socialLinksArray}) => {
  return (
    <>
     <div>
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <div className="flex space-x-4">
         {socialLinksArray.length > 0 ? ( // Use the new array here
              socialLinksArray.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
                  aria-label={link.name}
                > 
                  {/* Using Font Awesome classes based on the platform name */}
                  <i className={`fab fa-${link.name.toLowerCase()}`}></i>
                </a>
              ))
            ) : (
              <p className="text-sm">No social links provided.</p>
            )}
          </div>
        </div></>
  )
}

export default SocialLinkWithIcon