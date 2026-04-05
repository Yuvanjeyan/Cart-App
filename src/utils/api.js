const envApi = process.env.REACT_APP_API || "http://localhost:8000";
const normalizedApiRoot = envApi.endsWith("/")
  ? envApi.slice(0, -1)
  : envApi;

export const API_ROOT = normalizedApiRoot.replace(/\/api$/, "");
export const API_BASE = `${API_ROOT}/api`;
