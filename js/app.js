// Import Supabase Client CDN in your index.html head before app.js:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>

// Replace with your actual Supabase URL and public anon key
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const SUPABASE_URL = "https://eozvtyhbrksljvvqvlkq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvenZ0eWhicmtzbGp2dnF2bGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjcxOTYsImV4cCI6MjA2NzE0MzE5Nn0.undSFiOCF2KHM0B0vS_G1cP38WcV0dVANZst_lDrLLI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

$(document).ready(function () {
  const wineForm = $("#wine-form");
  const ratingSlider = $("#wine-rating");
  const ratingValue = $("#rating-value");
  const sweetnessSlider = $("#sweetness");
  const sweetnessValue = $("#sweetness-value");

  // Load wines from Supabase
  async function loadWines() {
    const { data, error } = await supabase.from("wines").select("*");
    if (error) {
      console.error("Error fetching wines:", error);
      return [];
    }
    return data;
  }

  // Save wine to Supabase
  async function saveWine(wine) {
    const { data, error } = await supabase
      .from("wines")
      .insert([wine])
      .select();
    if (error) {
      console.error("Error saving wine:", error);
    }
    return data;
  }

  // Delete wine from Supabase
  async function deleteWine(wineId) {
    const { error } = await supabase.from("wines").delete().eq("id", wineId);
    if (error) {
      console.error("Error deleting wine:", error);
    }
  }

  // Initialize DataTable
  const table = $("#wine-table").DataTable({
    data: [],
    columns: [
      { data: "name", title: "Wine Name" },
      { data: "alcohol", title: "ABV %", render: (d) => `${d}%` },
      { data: "grape", title: "Grape" },
      {
        data: "rating",
        title: "Rating",
        render: (d) => `${parseFloat(d).toFixed(1)} / 5 ⭐`,
      },
      { data: "sweetness", title: "Sweetness" },
      { data: "comment", title: "Comment" },
      {
        data: "id",
        title: "Action",
        render: (data) =>
          `<button class="delete-btn" data-id="${data}">Delete</button>`,
        orderable: false,
      },
    ],
    responsive: true,
    language: {
      emptyTable: "No wines added yet.",
    },
  });

  loadWines().then((wines) => {
    wines.forEach((wine) => {
      table.row.add(wine).draw();
    });
  });

  ratingSlider.on("input", () => {
    ratingValue.text(parseFloat(ratingSlider.val()).toFixed(1));
  });

  sweetnessSlider.on("input", () => {
    sweetnessValue.text(sweetnessSlider.val());
  });

  wineForm.on("submit", async (e) => {
    e.preventDefault();
    const wine = {
      name: $("#wine-name").val().trim(),
      alcohol: parseFloat($("#alcohol-amount").val()),
      grape: $("#grape-type").val().trim(),
      rating: parseFloat($("#wine-rating").val()),
      sweetness: parseInt($("#sweetness").val()),
      comment: $("#user-comment").val().trim(),
    };

    const saved = await saveWine(wine);
    if (saved && saved.length > 0) {
      table.row.add(saved[0]).draw();
      wineForm[0].reset();
      ratingValue.text("2.5");
      sweetnessValue.text("6");
    }
  });

  $("#wine-table tbody").on("click", ".delete-btn", async function () {
    const wineId = parseInt($(this).attr("data-id"));
    await deleteWine(wineId);
    table.row($(this).parents("tr")).remove().draw();
  });
});
