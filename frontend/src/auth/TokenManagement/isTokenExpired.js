
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return expiry < now;
  } catch (error) {
    console.log(error)
    return true;
  }
}

// 2. Helper: Refresh the token

export default isTokenExpired;