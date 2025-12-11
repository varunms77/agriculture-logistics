export const API_URL = "http://localhost:4000";

export async function createBatch(data: any) {
  const res = await fetch(`${API_URL}/api/batch/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addEvent(data: any) {
  const res = await fetch(`${API_URL}/api/event/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function verifyBatch(id: number) {
  const res = await fetch(`${API_URL}/api/verify/batch/${id}`);
  return res.json();
}