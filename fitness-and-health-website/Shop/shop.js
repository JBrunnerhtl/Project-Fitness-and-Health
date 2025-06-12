let allProductsData = [];
let initialLoadComplete = false;

const CATEGORY_KEYWORDS = {
    supplemente: [
        'supplement', 'nutrition', 'vitamin', 'protein',
        'creatine', 'aminosäure', 'bcaa', 'l-carnitine',
        'pre-workout', 'post-workout', 'mineral', 'ergänzung'
    ],
    fitness: [
        'fitness', 'sport', 'exercise', 'gym', 'train',
        'gewicht', 'hantel', 'matte', 'gerät', 'band',
        'maschine', 'yoga', 'pump', 'kraft', 'dumbbell',
        'kettlebell', 'pull-up', 'push-up', 'trainer'
    ]
};

const API_OPTIONS = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '4a3b481255msh943c59b750ca015p1df121jsn60f6a8ecc158',
        'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM Loaded. Initializing shop...");
    const submitButton = document.getElementById('submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', applyFilters);
    } else {
        console.error("Submit button not found!");
    }

    const container = document.getElementById('products-container');
    if (container) {
        container.innerHTML = '<p class="text-center translate-text" data-key="loading_products">Lade Produkte...</p>';
    }

    try {
        await Promise.all([
            loadProductsFromAPI('protein supplement'),
            loadProductsFromAPI('fitness equipment'),
            loadProductsFromAPI('workout gear'),
            loadProductsFromAPI('sports nutrition'),
            loadProductsFromAPI('gym accessories')
        ]);
        initialLoadComplete = true;
        console.log("Initial products loaded. Total unique products:", allProductsData.length);
        applyFilters();
    } catch (error) {
        console.error("Error during initial product load:", error);
        if (container) {
            container.innerHTML = '<p class="text-center text-danger translate-text" data-key="error_loading_products">Fehler beim Laden der Produkte.</p>';
        }
    }

    if (typeof applyTranslations === 'function' && typeof currentLanguage === 'string') {
        applyTranslations(currentLanguage);
    }
});

function applyFilters(event) {
    if (event) event.preventDefault();
    if (!initialLoadComplete) {
        console.log("Initial product data not yet loaded. Skipping filter application.");
        return;
    }

    console.log('Applying filters...');
    const maxPriceInput = document.getElementById('max-price').value;
    const categoryInput = document.getElementById('category').value;

    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : null;
    const selectedCategory = categoryInput || '';

    const filterInfoDiv = document.getElementById('filter-info');
    const filterCriteriaSpan = document.getElementById('filter-criteria');
    if (filterInfoDiv && filterCriteriaSpan) {
        let criteriaText = "Alle Produkte";
        if (selectedCategory && maxPrice !== null) {
            criteriaText = `Kategorie: ${getCategoryDisplayName(selectedCategory)}, Max Preis: ${maxPrice.toFixed(2)} €`;
        } else if (selectedCategory) {
            criteriaText = `Kategorie: ${getCategoryDisplayName(selectedCategory)}`;
        } else if (maxPrice !== null) {
            criteriaText = `Max Preis: ${maxPrice.toFixed(2)} €`;
        }
        filterCriteriaSpan.textContent = criteriaText;
        filterInfoDiv.style.display = 'block';
    }

    let filteredProducts = [...allProductsData];

    if (selectedCategory && CATEGORY_KEYWORDS[selectedCategory]) {
        const keywords = CATEGORY_KEYWORDS[selectedCategory];
        filteredProducts = filteredProducts.filter(product => {
            const category = (product.product_category || '').toLowerCase();
            const title = (product.product_title || '').toLowerCase();
            const description = (product.product_description || '').toLowerCase();

            return keywords.some(keyword =>
                category.includes(keyword) ||
                title.includes(keyword) ||
                description.includes(keyword)
            );
        });
    }

    if (maxPrice !== null) {
        filteredProducts = filteredProducts.filter(product => {
            const price = parseProductPrice(product);
            return !isNaN(price) && price > 0 && price <= maxPrice;
        });
    }

    console.log("Filtered products count:", filteredProducts.length);
    displayProducts(filteredProducts);
}

function getCategoryDisplayName(categoryValue) {
    if (categoryValue === 'supplemente') return 'Supplemente';
    if (categoryValue === 'fitness') return 'Fitnessgeräte';
    return 'Alle';
}

async function loadProductsFromAPI(query) {
    try {
        console.log(`Fetching products for query: ${query}`);
        const url = `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=de&language=de&limit=30`;
        const response = await fetch(url, API_OPTIONS);
        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.message || `HTTP error ${response.status}`;
            console.error(`Error fetching products for "${query}": ${errorMessage}`, data);
            throw new Error(errorMessage);
        }

        if (data.data?.products) {
            let newProductsAdded = 0;
            data.data.products.forEach((product) => {
                if (!allProductsData.some(p => p.product_id === product.product_id)) {
                    allProductsData.push(product);
                    newProductsAdded++;
                }
            });
            console.log(`${newProductsAdded} new unique products added from query: ${query}`);
        } else {
            console.warn(`No products found in response for query: ${query}`, data);
        }
    } catch (err) {
        console.error(`Failed to load products for query "${query}":`, err);
    }
}

function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error("Products container not found in displayProducts.");
        return;
    }
    container.innerHTML = "";

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<p class="text-center text-muted translate-text" data-key="no_products_found">Keine Produkte entsprechen Ihren Filterkriterien.</p>';
    } else {
        productsToDisplay.forEach(product => {
            const price = parseProductPrice(product);
            container.innerHTML += createProductCard(product, price);
        });
    }

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            showProductDetails(productId);
        });
    });
    if (typeof applyTranslations === 'function' && typeof currentLanguage === 'string') {
        applyTranslations(currentLanguage);
    }
}

function parseProductPrice(product) {
    const priceStr = product.offer?.price || (product.typical_price_range && product.typical_price_range.length > 0 ? product.typical_price_range[0] : '') || '';
    if (!priceStr) return NaN;
    const numericPrice = priceStr.replace(/[^\d,.]/g, '').replace(',', '.');
    return parseFloat(numericPrice);
}

function createProductCard(product, price) {
    const productTitle = product.product_title || "Unbenanntes Produkt";
    const productDescription = (product.product_description || 'Keine Beschreibung verfügbar').substring(0, 80) + "...";
    const imageUrl = product.product_photos?.[0] || 'https://via.placeholder.com/200x200.png?text=Kein+Bild';
    const priceDisplay = !isNaN(price) && price > 0 ? `${price.toFixed(2)} €` : 'Preis auf Anfrage';

    return `
    <div class="col mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${imageUrl}"
             class="card-img-top p-3"
             alt="${productTitle}"
             style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title translate-text" data-translate-force-content>${productTitle}</h5>
          <p class="card-text text-muted translate-text" data-translate-force-content>${productDescription}</p>
          <div class="mt-auto">
            <p class="text-success fw-bold translate-text" data-translate-force-content>${priceDisplay}</p>
            <button class="btn btn-outline-primary view-details translate-text"
                    data-product-id="${product.product_id}"
                    data-bs-toggle="modal"
                    data-bs-target="#productModal"
                    data-key="view_details_button">
              Details anzeigen
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showProductDetails(productId) {
    const product = allProductsData.find(p => p.product_id === productId);
    if (!product) {
        console.error("Product not found for details modal:", productId);
        return;
    }

    document.getElementById('modalProductTitle').textContent = product.product_title || "Produktdetails";
    document.getElementById('modalProductImage').src = product.product_photos?.[0] || 'https://via.placeholder.com/400x400.png?text=Kein+Bild';
    document.getElementById('modalProductImage').alt = product.product_title || "Produktbild";
    document.getElementById('modalProductDescription').textContent = product.product_description || 'Keine detaillierte Beschreibung verfügbar.';

    const price = parseProductPrice(product);
    document.getElementById('modalProductPrice').textContent = !isNaN(price) && price > 0 ? `${price.toFixed(2)} €` : 'Preis auf Anfrage';

    const ratingSpan = document.getElementById('modalProductRating');
    if (product.product_rating) {
        ratingSpan.textContent = `Bewertung: ${product.product_rating.toFixed(1)} / 5 (${product.product_num_ratings || 0} Bewertungen)`;
        ratingSpan.parentElement.style.display = 'block';
    } else {
        ratingSpan.parentElement.style.display = 'none';
    }


    if (typeof applyTranslations === 'function' && typeof currentLanguage === 'string') {
        applyTranslations(currentLanguage);
    }
}
