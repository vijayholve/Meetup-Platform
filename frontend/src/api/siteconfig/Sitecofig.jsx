import React, { useContext, useState, createContext, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../features/base/config";

export const SiteConfig = createContext();

const SiteConfingContent = ({ children }) => {
  const [siteConfigData, setSiteConfig] = useState({
    navbar_title: "",
    headers_name: "",
    footer_text: "",
    contact_email: "",
    social_links: "",
    homepage_banner: null,
    about_image: null,
    favicon: null,
    primary_color: "",
    secondary_color: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    about_text: "",
    phone_number: "",
    address: "",
    default_language: "en",
    privacy_policy: "",
    terms_and_conditions: "",
    is_maintenance: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.MAIN_URL}/siteconfig/main/`);
        const data = response.data;
        setSiteConfig({
          navbar_title: data.navbar_title || "",
          headers_name: data.headers_name || "",
          footer_text: data.footer_text || "",
          contact_email: data.contact_email || "",
          social_links: data.social_links || "",
          homepage_banner: data.homepage_banner || null,
          about_image: data.about_image || null,
          favicon: data.favicon || null,
          primary_color: data.primary_color || "",
          secondary_color: data.secondary_color || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          meta_keywords: data.meta_keywords || "",
          about_text: data.about_text || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          default_language: data.default_language || "en",
          privacy_policy: data.privacy_policy || "",
          terms_and_conditions: data.terms_and_conditions || "",
          is_maintenance: data.is_maintenance || false,
        });
        setError(null);
        console.log("Site configuration loaded successfully:", data);
      } catch (err) {
        console.error("Failed to fetch site config", err);
        setError("Failed to load site configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SiteConfig.Provider value={{ siteConfigData, setSiteConfig, loading, error }}>
      {children}
    </SiteConfig.Provider>
  );
};

export default SiteConfingContent;
