const ACCESS_TOKEN_KEY = "access_token";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (accessToken) => {
  if (!accessToken) {
    console.warn("Attempted to store empty access token");
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const setTokens = (accessToken) => {
  setAccessToken(accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const parseToken = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

export const isTokenExpired = () => {
  const token = getAccessToken();
  if (!token) return true;

  const payload = parseToken(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const getUserIdFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = parseToken(token);
  return payload?.userId || null;
};
