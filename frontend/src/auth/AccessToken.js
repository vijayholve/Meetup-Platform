import { useNavigate } from "react-router-dom";
import isTokenExpired from "./TokenManagement/isTokenExpired";
import refreshAccessToken from "./TokenManagement/refreshAccessToken";
; // adjust path

// Reusable function to get valid access token
export async function getValidAccessToken(navigate) {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  let access = tokens?.access;
try{

  if (!access || isTokenExpired(access)) {
    console.log("Access token expired or missing, trying to refresh...");
    access = await refreshAccessToken();
  }
  
  if (!access) {
    console.log("User needs to login again.");
    navigate("/login");
    return null;
  }
} catch (error) {
  console.error("Error while refreshing access token:", error);
}

  return access;
}
