import { apiClient } from "api";

export async function getCampaigns() {
  const ac = apiClient();
  return await ac.get("api/reviews/campaigns");
}

export async function getTask(id, mode) {
  const ac = apiClient();
  return await ac.get(`api/reviews/campaigns/${id}/get_task?mode=${mode}`);
}

export async function answerTask(id, data) {
  const ac = apiClient();
  return await ac.post(`api/reviews/campaigns/${id}/answer_task/`, data);
}
