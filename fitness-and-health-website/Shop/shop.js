
const API_OPTIONS = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '5df1f52fd4mshc8d2ad2b5cf104bp1de614jsn051b11ab2c0a', // Hier deinen Key eintragen
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
    const allProducts = Array.from(document.querySelectorAll('.view-details'))
        .map(button => {
            return {
                id: button.dataset.productId,
                title: button.closest('.card').querySelector('.card-title').textContent,
                image: button.closest('.card').querySelector('img').src,
                description: button.closest('.card').querySelector('.card-text').textContent,
                price: button.closest('.card').querySelector('.text-success').textContent
            };
        });

    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        console.error('Produkt nicht gefunden');
        return;
    }


    const modalTitle = document.getElementById('modalProductTitle');
    const modalImage = document.getElementById('modalProductImage');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalPrice = document.getElementById('modalProductPrice');

    modalTitle.textContent = product.title;
    modalImage.src = product.image;
    modalDescription.textContent = product.description.replace('...', ''); // Vollständige Beschreibung
    modalPrice.textContent = product.price;


    document.querySelector('#productModal .add-to-cart').style.display = 'none';
}