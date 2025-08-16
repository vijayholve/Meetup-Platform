
import axios from "axios";

async function refreshAccessToken() {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const refresh = tokens?.refresh;

  if (!refresh) return null;

  try {
    const res = await axios.post("/api/token/refresh/", { refresh });
    const newTokens = {
      access: res.data.access,
      refresh: refresh,
    };
    localStorage.setItem("tokens", JSON.stringify(newTokens));
    return newTokens.access;
  } catch (error) {
    console.log("Refresh token failed:", error);
    // Optional: redirect to login
    localStorage.removeItem("tokens");
    return null;
  }
}

export default refreshAccessToken ;