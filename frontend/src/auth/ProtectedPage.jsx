import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../features/base/config";
import { getValidAccessToken } from "./AccessToken";

const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();

        const accessToken =  getValidAccessToken(navigate);

  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(API_ENDPOINTS, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // User is authenticated
      } catch (err) {
        // Invalid token
        localStorage.removeItem("tokens");
        navigate("/login");
      }
    };

    verifyToken();
  }, [accessToken, navigate]);

  return accessToken ? children : null;
};

export default ProtectedPage;
