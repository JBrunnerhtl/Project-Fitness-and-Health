/*
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        alert('Produkt ' + productId + ' wurde zum Warenkorb hinzugefügt');
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '97e4f4d119msh97f5a1b0b13597bp181c37jsn8dd0583bd943',
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
    }
};

const query = 'fitness';

fetch(`https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=de&language=de`, options)
    .then(res => res.json())
    .then(response => {
        console.log(response);
        const products = response.data; // <- richtige Stelle!
        const container = document.getElementById('products-container');
        console.log(products.products);
        products.products.forEach(product => {
            container.innerHTML += `
                <div class="col">
                    <div class="card h-100">
                        <img src="${product.product_photos?.[0] || 'https://via.placeholder.com/200'}" 
                             class="card-img-top p-3" 
                             alt="${product.product_title}" 
                             style="height: 200px; object-fit: contain;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.product_title}</h5>
                            <p class="card-text">${(product.product_description || 'Keine Beschreibung').substring(0, 80)}...</p>
                            <div class="mt-auto">
                                <p class="text-success fw-bold">${product.offer?.price || 'Preis unbekannt'}</p>
                                <button class="btn btn-outline-primary view-details" 
                                        data-product-id="${product.product_id}"
                                        data-bs-toggle="modal" 
                                        data-bs-target="#productModal">
                                    Mehr erfahren
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    })
    .catch(err => {
        console.error('Fehler beim Abrufen:', err);
    });



            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-product-id');
                    fetch(`https://fakestoreapi.com/products/${productId}`)
                        .then(res => res.json())
                        .then(product => {
                            document.getElementById('modalProductTitle').textContent = product.title;
                            document.getElementById('modalProductDescription').textContent = product.description;
                            document.getElementById('modalProductPrice').textContent = `€${product.price}`;
                            document.getElementById('modalProductImage').src = product.image;
                            document.getElementById('modalProductRating').textContent =
                                `★ ${product.rating.rate} (${product.rating.count} Bewertungen)`;

                            document.querySelector('.add-to-cart').setAttribute('data-product-id', product.id);
                        });
                });
            });
        });


    document.querySelector('.add-to-cart').addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        alert(`Produkt ${productId} wurde zum Warenkorb hinzugefügt`);
    });


    document.getElementById('healthForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const problem = document.getElementById('problem').value;
        const maxPrice = document.getElementById('max-price').value;
        const category = document.getElementById('category').value;

        if (!problem || !maxPrice || !category) {
            alert('Bitte alle Felder ausfüllen');
            return;
        }

        alert('Formular erfolgreich abgesendet!');

    });
});
*/
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '97e4f4d119msh97f5a1b0b13597bp181c37jsn8dd0583bd943',
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
    }
};

const query = 'fitness';

fetch(`https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=de&language=de`, options)
    .then(res => res.json())
    .then(response => {
        console.log(response);
        const products = response.data; // <- richtige Stelle!
        const container = document.getElementById('products-container');
        console.log(products.products);
        products.products.forEach(product => {
            container.innerHTML += `
                <div class="col">
                    <div class="card h-100">
                        <img src="${product.product_photos?.[0] || 'https://via.placeholder.com/200'}" 
                             class="card-img-top p-3" 
                             alt="${product.product_title}" 
                             style="height: 200px; object-fit: contain;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.product_title}</h5>
                            <p class="card-text">${(product.product_description || 'Keine Beschreibung').substring(0, 80)}...</p>
                            <div class="mt-auto">
                                <p class="text-success fw-bold">${product.offer?.price || 'Preis unbekannt'}</p>
                                <button class="btn btn-outline-primary view-details" 
                                        data-product-id="${product.product_id}"
                                        data-bs-toggle="modal" 
                                        data-bs-target="#productModal">
                                    Mehr erfahren
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    })
    .catch(err => {
        console.error('Fehler beim Abrufen:', err);
    });
