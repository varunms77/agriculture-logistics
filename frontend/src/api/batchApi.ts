export const API_URL = "http://localhost:4000";

export async function createBatchAPI(data: any) {
    const res = await fetch(`${API_URL}/api/batch/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to create batch");
    }

    return res.json();
}