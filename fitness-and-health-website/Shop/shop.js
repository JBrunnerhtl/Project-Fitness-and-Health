let allProductsData = [];
const API_OPTIONS = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '5e3ee329abmsha7c07675e6393b6p13eea0jsnd88b9973abdf', // Hier deinen Key eintragen
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
    }
};


document.addEventListener('DOMContentLoaded', () => {
    loadProducts('fitness');
    loadProducts('fitness products');
    loadProducts('Suplements');


    document.getElementById('submit-button').addEventListener('click', applyFilters);
});


function applyFilters() {
    const inputPrice = document.getElementById('max-price').value;
    const inputCategory = document.getElementById('category').value;
    const container = document.getElementById('products-container');
    container.innerHTML = "";

    if (inputCategory === "supplemente") {
        loadProducts('Suplements', inputPrice);
    } else {
        loadProducts('fitness', inputPrice);
        loadProducts('fitness products', inputPrice);
    }
}

async function loadProducts(query, maxPrice = "") {
    try {
        const url = `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=de&language=de`;
        const response = await fetch(url, API_OPTIONS);
        const data = await response.json();
        data.data.products.forEach((product) => {
            allProductsData.push(product);

        })
        if (!response.ok) throw new Error(data.message || 'Fehler beim Abrufen der Produkte');

        displayProducts(data.data.products, maxPrice);
    } catch (err) {
        console.error('Fehler:', err);

    }
}


function displayProducts(products, maxPrice) {
    const container = document.getElementById('products-container');

    products.forEach(product => {
        const price = parseProductPrice(product);


        if (maxPrice && price > parseFloat(maxPrice)) {
            console.log(`Produkt ${product.product_title} ist teurer als ${maxPrice}`);
            return;
        }

        container.innerHTML += createProductCard(product, price);
    });


    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => showProductDetails(button.dataset.productId));
    });
}


function parseProductPrice(product) {
    const priceStr = product.offer?.price || product.typical_price_range?.[0] || '';
    const numericPrice = priceStr.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numericPrice) || 0;
}


function createProductCard(product, price) {
    return `
    <div class="col mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${product.product_photos?.[0] || 'https://via.placeholder.com/200'}" 
             class="card-img-top p-3" 
             alt="${product.product_title}" 
             style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.product_title}</h5>
          <p class="card-text text-muted">${(product.product_description || 'Keine Beschreibung verfügbar').substring(0, 80)}...</p>
          <div class="mt-auto">
            <p class="text-success fw-bold">${price ? `${price.toFixed(2)} €` : 'Preis auf Anfrage'}</p>
            <button class="btn btn-outline-primary view-details" 
                    data-product-id="${product.product_id}"
                    data-bs-toggle="modal" 
                    data-bs-target="#productModal">
              Details anzeigen
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}


function showProductDetails(productId) {
    console.log(allProductsData);
    const product = allProductsData.find(p => p.product_id === productId);
    if (!product) return;


    document.getElementById('modalProductTitle').textContent = product.product_title;
    document.getElementById('modalProductImage').src =
        product.product_photos?.[0] || 'https://via.placeholder.com/400';
    document.getElementById('modalProductDescription').textContent =
        product.product_description || 'Keine Beschreibung verfügbar';
    document.getElementById('modalProductPrice').textContent =
        product.offer?.price || 'Preis auf Anfrage';


    document.querySelector('#productModal .add-to-cart').style.display = 'none';


    const buyLink = document.getElementById('buyLink');
    const buyLinkText = document.getElementById('buyLinkText');

    if (product.offer?.offer_page_url) {

        buyLink.href = product.offer.offer_page_url;
        buyLinkText.textContent = product.offer.store_name
            ? `Bei ${product.offer.store_name} kaufen`
            : 'Zum Shop';
        buyLink.style.display = 'inline-block';


        if (product.offer.store_favicon) {
            buyLink.innerHTML = `
        <img src="${product.offer.store_favicon}" 
             height="16" 
             class="me-2" 
             alt="${product.offer.store_name || 'Shop'}">
        ${buyLinkText.textContent}
      `;
        }
    } else {

        buyLink.style.display = 'none';
    }
}