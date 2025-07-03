$(document).ready(function () {
  const wineForm = $("#wine-form");
  const ratingSlider = $("#wine-rating");
  const ratingValue = $("#rating-value");
  const sweetnessSlider = $("#sweetness");
  const sweetnessValue = $("#sweetness-value");

  // --- Local Storage Functions ---
  const getWines = () => {
    return JSON.parse(localStorage.getItem("wines")) || [];
  };

  const saveWines = (wines) => {
    localStorage.setItem("wines", JSON.stringify(wines));
  };

  // --- Datatable Initialization ---
  const table = $("#wine-table").DataTable({
    data: getWines(),
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

  // --- Event Handlers ---

  // Update rating value display when slider moves
  ratingSlider.on("input", () => {
    ratingValue.text(parseFloat(ratingSlider.val()).toFixed(1));
  });

  // Update sweetness value display when slider moves
  sweetnessSlider.on("input", () => {
    sweetnessValue.text(sweetnessSlider.val());
  });

  // Handle form submission
  wineForm.on("submit", (e) => {
    e.preventDefault();

    const wine = {
      id: Date.now(),
      name: $("#wine-name").val().trim(),
      alcohol: parseFloat($("#alcohol-amount").val()),
      grape: $("#grape-type").val().trim(),
      rating: parseFloat($("#wine-rating").val()),
      sweetness: parseInt($("#sweetness").val()),
      comment: $("#user-comment").val().trim(),
    };

    const wines = getWines();
    wines.push(wine);
    saveWines(wines);

    table.row.add(wine).draw();

    wineForm[0].reset();
    ratingValue.text("2.5");
    sweetnessValue.text("6");
  });

  // Handle delete button clicks using event delegation
  $("#wine-table tbody").on("click", ".delete-btn", function () {
    const wineId = parseInt($(this).attr("data-id"));

    let wines = getWines();
    wines = wines.filter((wine) => wine.id !== wineId);
    saveWines(wines);

    table.row($(this).parents("tr")).remove().draw();
  });
});
