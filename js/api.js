// Load wines from Supabase
export async function loadWines() {
  const res = await fetch("/.netlify/functions/get-wines");
  return await res.json();
}

// Save wine to Supabase
export async function saveWine(wine) {
  const res = await fetch("/.netlify/functions/save-wine", {
    method: "POST",
    body: JSON.stringify(wine),
  });
  return await res.json();
}

// Delete wine from Supabase
export async function deleteWine(wineId) {
  await fetch("/.netlify/functions/delete-wine", {
    method: "POST",
    body: JSON.stringify({ id: wineId }),
  });
}
