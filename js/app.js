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

  // ✅ Initialize Grid.js instead of DataTable
  let grid;

  loadWines().then((wines) => {
    const rows = wines.map((wine) => [
      wine.name,
      `${wine.alcohol}%`,
      wine.grape,
      wine.sweetness,
      `${parseFloat(wine.kayRating).toFixed(1)} / 5 ⭐`,
      `${parseFloat(wine.rebeckaRating).toFixed(1)} / 5 ⭐`,
      wine.comment || "",
      `<button class="delete-btn" data-id="${wine.id}">Delete</button>`,
    ]);

    grid = new gridjs.Grid({
      columns: [
        "Wine Name",
        "ABV %",
        "Grape",
        "Sweetness",
        "Rated by Kay",
        "Rated by Rebecka",
        "Comment",
        {
          name: "Action",
          formatter: (_, row) => gridjs.html(`${row.cells[7].data}`),
        },
      ],
      data: rows,
      pagination: true,
      search: true,
      sort: true,
    }).render(document.getElementById("wine-table"));
  });

  // Same sliders and form listeners as before
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
      grid
        .updateConfig({
          data: [
            ...grid.config.data,
            [
              saved[0].name,
              `${saved[0].alcohol}%`,
              saved[0].grape,
              saved[0].sweetness,
              `${parseFloat(saved[0].kayRating).toFixed(1)} / 5 ⭐`,
              `${parseFloat(saved[0].rebeckaRating).toFixed(1)} / 5 ⭐`,
              saved[0].comment || "",
              `<button class="delete-btn" data-id="${saved[0].id}">Delete</button>`,
            ],
          ],
        })
        .forceRender();

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

  // Delete handler
  $(document).on("click", ".delete-btn", async function () {
    const wineId = parseInt($(this).attr("data-id"));
    await deleteWine(wineId);
    // Filter out deleted row and re-render
    const filtered = grid.config.data.filter(
      (row) => !row[7].includes(`data-id="${wineId}"`)
    );
    grid.updateConfig({ data: filtered }).forceRender();
  });

  // Modal handlers same as before
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
