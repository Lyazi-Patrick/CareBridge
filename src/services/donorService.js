import { api } from "./apiClient.js";

export async function getDonorDashboard() {
  return api.get("/donor/dashboard");
}
