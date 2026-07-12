import { api } from "./apiClient.js";

export async function getPatientDashboard() {
  return api.get("/patient/dashboard");
}
