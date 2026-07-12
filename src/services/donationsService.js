import { api } from "./apiClient.js";

export async function createDonation({ caseId, amount }) {
  const data = await api.post("/donations", { caseId, amount });
  return data;
}
