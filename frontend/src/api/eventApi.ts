export const API_URL = "http://localhost:4000";

export async function addEventAPI(batchId: any, formData: FormData) {
    const res = await fetch(`${API_URL}/api/event/add/${batchId}`, {
        method: "POST",
        body: formData, // multipart upload (files)
    });

    if (!res.ok) throw new Error("Failed to add event");

    return res.json();
}
