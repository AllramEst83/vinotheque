import { loadWines, saveWine, deleteWine } from "./api.js";

$(document).ready(function () {
  const wineForm = $("#wine-form");
  const ratingSlider = $("#wine-rating");
  const ratingValue = $("#rating-value");
  const sweetnessSlider = $("#sweetness");
  const sweetnessValue = $("#sweetness-value");
  const kayRatingSlider = $("#kay-rating");
  const kayRatingValue = $("#kay-rating-value");
  const rebeckaRatingSlider = $("#rebecka-rating");
  const rebeckaRatingValue = $("#rebecka-rating-value");
  const modal = document.getElementById("wine-modal");
  const openBtn = document.getElementById("open-modal");
  const closeBtn = document.getElementById("close-modal");

  // Initialize DataTable
  const table = $("#wine-table").DataTable({
    data: [],
    columns: [
      { data: "name", title: "Wine Name" },
      { data: "alcohol", title: "ABV %", render: (d) => `${d}%` },
      { data: "grape", title: "Grape" },
      {
        data: "kayRating",
        title: "Rated by Kay",
        render: (d) => `${parseFloat(d).toFixed(1)} / 5 ⭐`,
      },
      {
        data: "rebeckaRating",
        title: "Rated by Rebecka",
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
  kayRatingSlider.on("input", () => {
    kayRatingValue.text(parseFloat(kayRatingSlider.val()).toFixed(1));
  });
  rebeckaRatingSlider.on("input", () => {
    rebeckaRatingValue.text(parseFloat(rebeckaRatingSlider.val()).toFixed(1));
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
      kayRating: parseFloat($("#kay-rating").val()),
      rebeckaRating: parseFloat($("#rebecka-rating").val()),
      sweetness: parseInt($("#sweetness").val()),
      comment: $("#user-comment").val().trim(),
    };

    const saved = await saveWine(wine);
    if (saved && saved.length > 0) {
      table.row.add(saved[0]).draw();
      wineForm[0].reset();
      ratingValue.text("2.5");
      kayRatingValue.text("2.5");
      rebeckaRatingValue.text("2.5");
      sweetnessValue.text("6");

      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  });

  $("#wine-table tbody").on("click", ".delete-btn", async function () {
    const wineId = parseInt($(this).attr("data-id"));
    await deleteWine(wineId);
    // Handle responsive child row selection
    const tr = $(this).closest("tr");
    const row = table.row(tr.hasClass("child") ? tr.prev() : tr);
    row.remove().draw(false);
  });

  openBtn.onclick = function () {
    modal.classList.add("show");
    setTimeout(() => {
      modal.style.display = "block";
    }, 10);
  };
  closeBtn.onclick = function () {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };
});
