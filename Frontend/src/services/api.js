// Centralized API service for talking to the Flask backend.
// Endpoints match Specifications/API_Requests.md and GitHub issue #34.
//
// Configure via Frontend/.env:
//   VITE_API_URL  - base URL of the backend (e.g. http://localhost:5000)
//   VITE_API_KEY  - API key sent in the Authorization header

const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const API_KEY = import.meta.env.VITE_API_KEY ?? '';

function authHeaders(extra = {}) {
  return {
    Authorization: API_KEY,
    ...extra,
  };
}

// Shared response handler: throws a meaningful Error on non-2xx responses so
// callers can surface message text in the UI.
async function handleResponse(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // No/!JSON body — leave body as null.
  }

  if (!response.ok) {
    const message = body?.error ?? `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

// 1. Look up a scanned student.
// GET /api/student?barcode=<barcode>
export async function getStudent(barcode) {
  const response = await fetch(
    `${BASE_URL}/api/student?barcode=${encodeURIComponent(barcode)}`,
    { headers: authHeaders() },
  );
  return handleResponse(response);
}

// 2. Sign a student out / in (school leave). Backend toggles based on state.
// POST /api/student/leave
export async function studentLeave({ barcode, destinationId, reason }) {
  const response = await fetch(`${BASE_URL}/api/student/leave`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      barcode,
      destination_id: destinationId,
      reason,
    }),
  });
  return handleResponse(response);
}

// 3. Sign equipment out / in. Backend toggles based on state.
// POST /api/equipment/signout
export async function equipmentSignOut({ studentBarcode, equipmentBarcode }) {
  const response = await fetch(`${BASE_URL}/api/equipment/signout`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      student_barcode: studentBarcode,
      equipment_barcode: equipmentBarcode,
    }),
  });
  return handleResponse(response);
}
