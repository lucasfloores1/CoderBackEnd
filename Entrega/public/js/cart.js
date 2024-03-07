document.addEventListener('DOMContentLoaded', function() {
    // Manejar el click en el botón de borrar producto
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', async function(event) {
            event.preventDefault();
            const cartId = button.getAttribute('data-cart-id');
            const productId = button.getAttribute('data-product-id');
            try {
                await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE'
                });
                // Recargar la página después de borrar el producto
                window.location.reload();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        });
    });

    // Manejar el click en el botón de borrar carrito
    document.querySelector('.delete-cart').addEventListener('click', async function(event) {
        event.preventDefault();
        const cartId = this.getAttribute('data-cart-id');
        try {
            await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE'
            });
            // Redirigir a la página de productos después de borrar el carrito
            window.location.href = '/products';
        } catch (error) {
            console.error('Error deleting cart:', error);
        }
    });

    // Manejar el click en el botón de comprar carrito
    document.querySelector('.purchase-cart').addEventListener('click', async function(event) {
        event.preventDefault();
        const cartId = this.getAttribute('data-cart-id');
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST'
            });
            await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE'
            });
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.log('Solicitud POST exitosa:', response);
            }
        } catch (error) {
            console.error('Error purchasing cart:', error);
        }
    });
});