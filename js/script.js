// Define total number of pages
const totalPages = 20;
const variations = ["Variation A", "Variation B", "Variation C", "Variation D", "Variation E"];


// Get elements
const pageInfo = document.getElementById("page-info");
const pageContent = document.getElementById("page-content");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Get current page from URL or default to 1
let currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

// Ensure page number is within valid range
currentPage = Math.max(1, Math.min(currentPage, totalPages));

// Define the base text (same for all pages)
const baseText = "It’s turned cold: cold so that saucers of ice lie in the mud, blank and crazed as antique porcelain. Cold so the hedges are alive with Baltic blackbirds; so cold that each breath hangs like parcelled seafog in the air. The blue sky rings with it, and the bell on Mabels tail is dimmed with condensation. Cold, cold, cold. My feet crack the ice in the mud as I trudge uphill. And because the squeaks and grinding harmonics of fracturing ice sound to Mabel like a wounded animal, every step I take is met with a convulsive clench of her toes. Where the world isn’t white with frost, it’s striped green and brown in strong sunlight, so the land is particoloured and snapping backwards to dawn and forwards to dusk. The days, now, are a bare six hours long.";

// Define attributes for each page (you can expand this)
const pageAttributes = {
    1: {  fontSize: "16px", fontWeight: "normal" },
    2: { fontSize: "18px", fontWeight: "bold" },
    3: { fontSize: "20px", fontWeight: "lighter" },
    4: { fontSize: "22px", fontWeight: "bold" },
    5: { fontSize: "24px", fontWeight: "normal" },
    6: { fontSize: "16px", fontWeight: "normal" },
   
};

// Function to update content and styles dynamically
function updatePage() {
    const variationIndex = Math.floor((currentPage - 1) / 4); // Groups pages into sets of 4
    const variationName = variations[variationIndex];

    pageInfo.textContent = `Excerpt from H is for Hawk by Helen MacDonald – ${variationName} – Page ${currentPage}`;
    pageContent.textContent = baseText;

    // Apply styles based on attributes
    if (pageAttributes[currentPage]) {
        pageContent.style.color = pageAttributes[currentPage].color;
        pageContent.style.fontSize = pageAttributes[currentPage].fontSize;
        pageContent.style.fontWeight = pageAttributes[currentPage].fontWeight;
    }

    // Update URL without reloading the page
    window.history.pushState({}, "", `?page=${currentPage}`);

    // Disable buttons at page limits
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === totalPages);
}

// Button Click Events
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        updatePage();
    }
});

// Initialize page content
updatePage();
