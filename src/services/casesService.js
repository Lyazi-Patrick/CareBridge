import { api } from "./apiClient.js";

export async function listCases({ search, category, urgency } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (urgency) params.set("urgency", urgency);
  const qs = params.toString();
  const data = await api.get(`/cases${qs ? `?${qs}` : ""}`, { auth: false });
  return data.cases;
}

export async function getCase(id) {
  const data = await api.get(`/cases/${id}`, { auth: false });
  return data.case;
}

export async function getCategories() {
  const data = await api.get("/cases/categories", { auth: false });
  return data.categories;
}

export async function getCaseAISummary(id) {
  const data = await api.get(`/cases/${id}/ai-summary`, { auth: false });
  return data.summary;
}

export async function createCase(form) {
  const data = await api.post("/cases", form);
  return data.case;
}

export async function requestFormAssist({ patientName, condition, description }) {
  const data = await api.post("/cases/ai-assist", { patientName, condition, description });
  return data.text;
}
