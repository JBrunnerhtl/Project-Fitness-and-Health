
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        alert('Produkt ' + productId + ' wurde zum Warenkorb hinzugefügt');
    });
});

document.addEventListener('DOMContentLoaded', function() {

    fetch('https://fakestoreapi.com/products?limit=3')
        .then(res => res.json())
        .then(products => {
            const container = document.getElementById('products-container');

            products.forEach(product => {
                container.innerHTML += `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.description.substring(0, 80)}...</p>
                                <div class="mt-auto">
                                    <p class="text-success fw-bold">€${product.price}</p>
                                    <button class="btn btn-outline-primary view-details" 
                                            data-product-id="${product.id}"
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