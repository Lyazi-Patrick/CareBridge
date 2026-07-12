import { api } from "./apiClient.js";

export async function getPlatformStats() {
  return api.get("/stats", { auth: false });
}
