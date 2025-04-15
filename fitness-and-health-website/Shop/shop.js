
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        alert('Produkt ' + productId + ' wurde zum Warenkorb hinzugefügt');
    });
});



loadProducts('fitness')
loadProducts('fitness products')
loadProducts('Suplements')

const button = document.getElementById('submit-button');

button.addEventListener('click', function() {
    const inputPrice = document.getElementById('max-price').value;
    const inputCategory = document.getElementById('category').value;
    const container = document.getElementById('products-container');
    container.innerHTML = ""; // Clear previous products

    if(inputCategory === "supplemente")
    {
        loadProducts('Suplements', inputPrice);
    }
    else
    {
        loadProducts('fitness' ,inputPrice);
        loadProducts('fitness products', inputPrice)
    }

})
async function loadProducts(query, price = "") {

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '97e4f4d119msh97f5a1b0b13597bp181c37jsn8dd0583bd943',
            'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
        }
    };
    fetch(`https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=de&language=de`, options)
        .then(res => res.json())
        .then(response => {
            console.log(response);
            const products = response.data; // <- richtige Stelle!
            const container = document.getElementById('products-container');
            console.log(products.products);
            products.products.forEach(product => {

                let productPrice = product.typical_price_range[0];
                let newPrice = "";


                console.log('length: ' + productPrice.length);



                for (let i = 0; i < productPrice.length; i++) {

                    if(typeof productPrice[i] === 'number' ||productPrice[i] === ',')
                    {
                        console.log(productPrice[i]);
                        newPrice+= productPrice[i].toString();
                    }
                }
                console.log(newPrice);
                if(typeof price === "string" || newPrice <= price)
                {


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
                }
                else
                {
                    console.log("Produkt ist teurer als der Preis");
                }
            });
        })
        .catch(err => {
            console.error('Fehler beim Abrufen:', err);
        });
}