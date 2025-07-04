// Load wines from Supabase (via Netlify Function)
export async function loadWines() {
  const res = await fetch("/.netlify/functions/get-wines");
  return await res.json();
}

// Save wine to Supabase (via Netlify Function)
export async function saveWine(wine) {
  const res = await fetch("/.netlify/functions/save-wine", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // ✅ always include this for POST JSON
    body: JSON.stringify(wine),
  });
  return await res.json();
}

// Delete wine from Supabase (via Netlify Function)
export async function deleteWine(wineId) {
  const res = await fetch("/.netlify/functions/delete-wine", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // ✅ always include this
    body: JSON.stringify({ id: wineId }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Delete wine error:", text);
  }

  return await res.json();
}
