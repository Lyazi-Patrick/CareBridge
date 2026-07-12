import { api } from "./apiClient.js";

export async function getHospitalDashboard() {
  return api.get("/hospital/dashboard");
}
