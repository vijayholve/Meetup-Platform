import React, { useContext } from 'react';
import { SiteConfig } from '../../api/siteconfig/Sitecofig';
import SocialLinkWithIcon from './SocialLinkWithIcon'; // Ensure this path is correct

const Footer = () => {
  const { siteConfigData } = useContext(SiteConfig);

  // Console logs are good for debugging, but typically removed in production
  // console.log("siteConfigData:", siteConfigData);
  // if (siteConfigData) {
  //   console.log("social_links from siteConfigData:", siteConfigData.social_links);
  // }

  if (!siteConfigData) {
    return null; // Don't render footer if data isn't available
  }

  const {
    navbar_title,
    footer_text,
    contact_email,
    social_links,
    phone_number,
    address,
    privacy_policy,
    terms_and_conditions,
    about_text,
  } = siteConfigData;

  const currentYear = new Date().getFullYear();

  // Convert the social_links object into an array of { name: 'platform', url: 'link' }
  const socialLinksArray = social_links ? Object.entries(social_links).map(([platform, url]) => ({
    name: platform, // e.g., "twitter", "facebook"
    url: url,        // e.g., "https://twitter.com/yourhandle"
  })) : [];

  // console.log("socialLinksArray:", socialLinksArray);

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">

        {/* Column 1: Company Info / About */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {navbar_title && (
            <h3 className="text-2xl font-bold text-white mb-4 transition-colors duration-300 hover:text-blue-400">
              {navbar_title}
            </h3>
          )}
          {about_text && (
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              {about_text.length > 180 ? `${about_text.substring(0, 180)}...` : about_text}
            </p>
          )}
        </div>

        {/* Column 2: Contact Us */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="text-sm space-y-3 text-gray-400">
            {address && (
              <li className="flex items-center justify-center md:justify-start">
                {/* Ensure Font Awesome is loaded for these icons */}
                <i className="fas fa-map-marker-alt text-lg mr-3 text-gray-500"></i>
                <p>{address}</p>
              </li>
            )}
            {phone_number && (
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-phone text-lg mr-3 text-gray-500"></i>
                <a href={`tel:${phone_number}`} className="hover:text-white transition-colors duration-200">
                  {phone_number}
                </a>
              </li>
            )}
            {contact_email && (
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-envelope text-lg mr-3 text-gray-500"></i>
                <a href={`mailto:${contact_email}`} className="hover:text-white transition-colors duration-200">
                  {contact_email}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Column 3: Quick Links (Privacy/Terms) */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Legal & Links</h3>
          <ul className="text-sm space-y-3 text-gray-400">
            {privacy_policy && (
              <li>
                <a href={privacy_policy} className="hover:text-white transition-colors duration-200 block">
                  Privacy Policy
                </a>
              </li>
            )}
            {terms_and_conditions && (
              <li>
                <a href={terms_and_conditions} className="hover:text-white transition-colors duration-200 block">
                  Terms & Conditions
                </a>
              </li>
            )}
            {/* Added some common quick links that are often in footers */}
            <li>
                <a href="/faq" className="hover:text-white transition-colors duration-200 block">
                  FAQ
                </a>
            </li>
            <li>
                <a href="/careers" className="hover:text-white transition-colors duration-200 block">
                  Careers
                </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Media (using your SocialLinkWithIcon component) */}
        <div className="text-center md:text-left">
          {/* We're passing the title and the prepared array to your component */}
          <SocialLinkWithIcon title="Connect With Us" socialLinksArray={socialLinksArray} />
        </div>
      </div>

      {/* Footer Bottom (Copyright) */}
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
        {footer_text ? (
          <p>{footer_text}</p>
        ) : (
          <p>&copy; {currentYear} {navbar_title || 'Your Company Name'}. All rights reserved.</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;