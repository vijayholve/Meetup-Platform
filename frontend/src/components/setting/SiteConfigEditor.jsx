import React, { useContext, useEffect, useState } from "react";
import { SiteConfig } from "../../api/siteconfig/Sitecofig";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import { API_ENDPOINTS } from "../../features/base/config";
import PageLoader from "../loading/PageLoader";

const SiteConfigEditor = () => {
  const { siteConfigData, setSiteConfig } = useContext(SiteConfig);
  useEffect(() => {
    if (siteConfigData && Object.keys(siteConfigData).length > 0) {
      setFormData(siteConfigData);
    }
  }, [siteConfigData]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(siteConfigData || {});
  const [error, setError] = useState(null); // State to hold error messages
  const [successMessage, setsuccessMessage] = useState("");
  const [updateImages, setUpdateImages] = useState({
    navbar_image: false,
    homepage_banner: false,
    about_image: false,
    favicon: false,
  });

  const [openMessage, setOpenMessage] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError(null);
  };
  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  // console.log(formData.navbar_image);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataObj = new FormData();

    try {
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          // 🔐 Special handling for social_links

          if (key === "social_links") {
            let value = formData[key];

            if (typeof value === "string") {
              try {
                value = JSON.stringify(JSON.parse(value)); // Validate and re-stringify
              } catch (err) {
                throw new Error("social_links: Value must be valid JSON.");
              }
            } else if (typeof value === "object") {
              value = JSON.stringify(value);
            }

            formDataObj.append(key, value);
          } else {
// For image fields, only append if updateImages[fieldName] is true
if (
  ["navbar_image", "homepage_banner", "about_image", "favicon"].includes(key)
) {
  if (updateImages[key] && formData[key]) {
    formDataObj.append(key, formData[key]);
  }
} else {
  formDataObj.append(key, formData[key]);
}
          }
        }
      });

      const response = await axios.patch(
        `${API_ENDPOINTS.MAIN_URL}/siteconfig/main/`,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSiteConfig(response.data);
      setOpenMessage(true);
      setLoading(false);
      setsuccessMessage("Site configuration updated successfully!");
      setError(null);
    } catch (error) {
      if (error.message?.includes("social_links")) {
        setError(error.message);
      } else if (error.response) {
        const errorDetails = error.response.data.details || {};
        const errorMessages = Object.entries(errorDetails)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");

        setError(
          errorMessages || error.response.data.error || "Something went wrong"
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setOpenMessage(false);
      setLoading(false);
    }
  };

  if (!siteConfigData || Object.keys(siteConfigData).length === 0) {
    return <PageLoader reason="setting detail" />;
  }

  return (
    <Box sx={{ p: 3, maxWidth: "600px", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Site Configuration
      </Typography>

      {/* Display error message */}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Navbar Title"
            name="navbar_title"
            value={formData.navbar_title || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={updateImages.navbar_image}
                onChange={(e) =>
                  setUpdateImages({
                    ...updateImages,
                    navbar_image: e.target.checked,
                  })
                }
              />
            }
            label="Update Navbar Image"
          />
          {updateImages.navbar_image && (
            <>
              <Typography variant="subtitle2">Navbar Image</Typography>
              <input
                type="file"
                name="navbar_image"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, navbar_image: e.target.files[0] })
                }
              />
            </>
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={updateImages.homepage_banner}
                onChange={(e) =>
                  setUpdateImages({
                    ...updateImages,
                    homepage_banner: e.target.checked,
                  })
                }
              />
            }
            label="Update Homepage Image"
          />
          {updateImages.homepage_banner && (
            <>
              <Typography variant="subtitle2">Homepage Banner</Typography>
              <input
                type="file"
                name="homepage_banner"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    homepage_banner: e.target.files[0],
                  })
                }
              />
            </>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={updateImages.about_image}
                onChange={(e) =>
                  setUpdateImages({
                    ...updateImages,
                    about_image: e.target.checked,
                  })
                }
              />
            }
            label="Update About Image"
          />
          {updateImages.about_image && (
            <>
              <Typography variant="subtitle2">About Image</Typography>
              <input
                type="file"
                name="about_image"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, about_image: e.target.files[0] })
                }
              />
            </>
          )}
        </Box>

          
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={updateImages.favicon}
                onChange={(e) =>
                  setUpdateImages({
                    ...updateImages,
                    favicon: e.target.checked,
                  })
                }
              />
            }
            label="Update Favicon Image"
          />
          {updateImages.favicon && (
            <>
          <Typography variant="subtitle2">Favicon</Typography>
          <input
            type="file"
            name="favicon"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, favicon: e.target.files[0] })
            }
        />
            </>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Header Name"
            name="headers_name"
            value={formData.headers_name || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Footer Text"
            name="footer_text"
            value={formData.footer_text || ""}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Contact Email"
            name="contact_email"
            value={formData.contact_email || "" || ""}
            onChange={handleChange}
          />
        </Box>

        {/* Homepage Banner */}

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Primary Color"
            name="primary_color"
            value={formData.primary_color || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Secondary Color"
            name="secondary_color"
            value={formData.secondary_color || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Meta Title"
            name="meta_title"
            value={formData.meta_title || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Meta Description"
            name="meta_description"
            value={formData.meta_description || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Meta Keywords"
            name="meta_keywords"
            value={formData.meta_keywords || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="About Text"
            name="about_text"
            value={formData.about_text || ""}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Default Language"
            name="default_language"
            value={formData.default_language || ""}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Social Links (JSON)"
            name="social_links"
            value={
              typeof formData.social_links === "object"
                ? JSON.stringify(formData.social_links, null, 2)
                : formData.social_links
            }
            onChange={(e) => {
              setFormData({ ...formData, social_links: e.target.value });
              try {
                JSON.parse(e.target.value); // Just for validation
                setError(null);
              } catch {
                setError("Invalid JSON in social_links");
              }
            }}
            multiline
            rows={3}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Privacy Policy"
            name="privacy_policy"
            value={formData.privacy_policy || ""}
            onChange={handleChange}
            multiline
            rows={5}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Terms and Conditions"
            name="terms_and_conditions"
            value={formData.terms_and_conditions || ""}
            onChange={handleChange}
            multiline
            rows={5}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_maintenance}
                name="is_maintenance"
                onChange={handleChange}
              />
            }
            label="Enable Maintenance Mode"
          />
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Setting"}
        </button>
      </form>
      {successMessage && (
        <Snackbar
          open={openMessage}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
        >
          <Alert
            onClose={handleCloseMessage}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default SiteConfigEditor;
