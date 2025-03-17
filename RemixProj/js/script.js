// Define total number of pages
const totalPages = 20;
const variations = ["WEIGHT", "FONT", "SLANT", "BORDER", "SPACE"];

// Get elements
const pageInfo = document.getElementById("page-info");
const pageContent = document.getElementById("page-content");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Get current page from URL or default to 1
let currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

// Ensure page number is within valid range
currentPage = Math.max(1, Math.min(currentPage, totalPages));

// Define the base text for all pages
const baseText = `
    <span class="line-1">It’s turned <span class="word-cold">cold</span>: <span class="word-cold">cold</span> so that <span class="word-saucers">saucers</span> of 
    <span class="word-ice">ice</span> lie in the mud, blank and crazed as antique porcelain.</span> 
    
    <span class="line-2"><span class="word-cold">Cold</span> so the hedges are alive with Baltic 
    <span class="word-blackbirds">blackbirds</span>; so <span class="word-cold">cold</span> that each breath 
    hangs like parcelled <span class="word-seafog">seafog</span> in the air.</span> 
    
    <span class="line-3">The blue sky rings with it, and the bell on Mabel’s tail is dimmed with 
    <span class="word-condensation">condensation</span>.</span> 
    
    <span class="line-4"><span class="word-cold">Cold</span>, <span class="word-cold">cold</span>, <span class="word-cold">cold</span>.</span> 
    
    <span class="line-5">My feet crack the <span class="word-ice">ice</span> in the mud as I trudge uphill.</span> 
    
    <span class="line-6">And because the squeaks and grinding <span class="word-harmonics">harmonics</span> 
    of <span class="word-fracturing">fracturing </span><span class="word-ice">ice</span> sound to Mabel like a <span class="word-wounded">wounded</span> animal, every step I take is met with a <span class="word-convulsive">convulsive</span> 
    <span class="word-clench">clench</span> of her toes.</span> 
    
    <span class="line-7">Where the world isn’t <span class="word-white">white</span> with frost, it’s striped green and 
    brown in strong sunlight, so the land is <span class="word-particoloured">particoloured</span> and <span class="word-snapping">snapping</span> 
    backwards to dawn and forwards to dusk.</span> 
    
    <span class="line-8">The days, now, are a <span class="word-bare">bare</span> six hours long.</span>
`;

//GPT wrapped spans for me!


// Function to update content and styles dynamically
// Function to update content and styles dynamically
function updatePage() {
    const variationIndex = Math.floor((currentPage - 1) / 4); // Groups pages into sets of 4
    const variationName = variations[variationIndex];

    // Update text content
    pageInfo.textContent = `Excerpt from H is for Hawk by Helen MacDonald – ${variationName} – Page ${currentPage}`;
    pageContent.innerHTML = baseText;

    // Remove old page classes from <body>
    document.body.classList.forEach(className => {
        if (className.startsWith("page-")) {
            document.body.classList.remove(className);
        }
    });

    // Add the new page-specific class to <body>
    document.body.classList.add(`page-${currentPage}`);

    // Remove old page classes from pageContent
    Array.from(pageContent.classList).forEach(className => {
        if (className.startsWith("page-")) {
            pageContent.classList.remove(className);
        }
    });

    // Add the new page-specific class to pageContent
    pageContent.classList.add(`page-${currentPage}`);

    // Update URL without reloading the page
    window.history.pushState({}, "", `?page=${currentPage}`);

    // Update button states
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
