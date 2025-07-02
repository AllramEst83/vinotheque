document.addEventListener("DOMContentLoaded", () => {
  const wineForm = document.getElementById("wine-form");
  const wineList = document.getElementById("wine-list");
  const ratingSlider = document.getElementById("wine-rating");
  const ratingValue = document.getElementById("rating-value");
  const sweetnessSlider = document.getElementById("sweetness");
  const sweetnessValue = document.getElementById("sweetness-value");
  const tableHeader = document.querySelector("#wine-table thead");

  // --- State Management ---
  let sortState = {
    column: null, // 'rating', 'alcohol', 'grape', 'sweetness'
    direction: "asc", // 'asc' or 'desc'
  };

  // --- Local Storage Functions ---
  const getWines = () => {
    return JSON.parse(localStorage.getItem("wines")) || [];
  };

  const saveWines = (wines) => {
    localStorage.setItem("wines", JSON.stringify(wines));
  };

  // --- Rendering Logic ---
  const renderWines = () => {
    let wines = getWines();

    // Sort wines if a sort column is set
    if (sortState.column) {
      wines.sort((a, b) => {
        const valA = a[sortState.column];
        const valB = b[sortState.column];

        let comparison = 0;
        if (typeof valA === "string") {
          comparison = valA.localeCompare(valB);
        } else {
          comparison = valA - valB;
        }

        return sortState.direction === "asc" ? comparison : -comparison;
      });
    }

    // Clear current list
    wineList.innerHTML = "";

    if (wines.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML =
        '<td colspan="7" style="text-align:center; padding: 20px; display: block;">No wines added yet.</td>';
      wineList.appendChild(emptyRow);
      return;
    }

    wines.forEach((wine) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td data-label="Wine Name">${wine.name}</td>
                <td data-label="ABV %">${wine.alcohol}%</td>
                <td data-label="Grape">${wine.grape}</td>
                <td data-label="Rating">${parseFloat(wine.rating).toFixed(
                  1
                )} / 5 ⭐</td>
                <td data-label="Sweetness">${wine.sweetness}</td>
                <td data-label="Comment">${wine.comment}</td>
                <td data-label="Action">
                    <button class="delete-btn" data-id="${
                      wine.id
                    }">Delete</button>
                </td>
            `;
      wineList.appendChild(row);
    });

    updateSortIcons();
  };

  const updateSortIcons = () => {
    // Clear all icons first
    document.querySelectorAll(".sortable").forEach((th) => {
      th.classList.remove("asc", "desc");
    });

    if (sortState.column) {
      const sortedHeader = document.querySelector(
        `.sortable[data-sort="${sortState.column}"]`
      );
      if (sortedHeader) {
        sortedHeader.classList.add(sortState.direction);
      }
    }
  };

  // --- Event Handlers ---

  // Update rating value display when slider moves
  ratingSlider.addEventListener("input", () => {
    ratingValue.textContent = parseFloat(ratingSlider.value).toFixed(1);
  });

  // Update sweetness value display when slider moves
  sweetnessSlider.addEventListener("input", () => {
    sweetnessValue.textContent = sweetnessSlider.value;
  });

  // Handle form submission
  wineForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const wine = {
      id: Date.now(), // Use a unique ID for each wine
      name: document.getElementById("wine-name").value.trim(),
      alcohol: parseFloat(document.getElementById("alcohol-amount").value),
      grape: document.getElementById("grape-type").value.trim(),
      rating: parseFloat(document.getElementById("wine-rating").value),
      sweetness: parseInt(document.getElementById("sweetness").value),
      comment: document.getElementById("user-comment").value.trim(),
    };

    const wines = getWines();
    wines.push(wine);
    saveWines(wines);

    renderWines();
    wineForm.reset();
    ratingValue.textContent = "2.5"; // Reset slider display
    sweetnessValue.textContent = "5"; // Reset sweetness display
  });

  // Handle delete button clicks using event delegation
  wineList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const wineId = parseInt(e.target.getAttribute("data-id"));

      let wines = getWines();
      wines = wines.filter((wine) => wine.id !== wineId);
      saveWines(wines);

      renderWines();
    }
  });

  // Handle sorting clicks using event delegation
  tableHeader.addEventListener("click", (e) => {
    const header = e.target.closest(".sortable");
    if (!header) return;

    const sortColumn = header.dataset.sort;

    if (sortState.column === sortColumn) {
      // If same column, toggle direction
      sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    } else {
      // If new column, set to ascending
      sortState.column = sortColumn;
      sortState.direction = "asc";
    }

    renderWines();
  });

  // --- Initial Load ---
  renderWines();
});
