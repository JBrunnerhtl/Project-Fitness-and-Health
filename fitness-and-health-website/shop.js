function validateForm() {
    const problem = document.getElementById('problem').value;
    const maxPrice = document.getElementById('max-price').value;
    const category = document.getElementById('category').value;

    if (!problem || !maxPrice || !category) {
        alert('Bitte alle Felder ausfüllen');
        return false;
    }

    return true;
}


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        alert('Produkt ' + productId + ' wurde zum Warenkorb hinzugefügt');
    });
});