
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const userTitle = document.getElementById('user-title');
    const uid = userTitle.getAttribute('user-id')

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            event.preventDefault();
            
            const pid = button.getAttribute('product-id');
            
            try {
                const response = await fetch(`/api/carts/${uid}/products/${pid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    console.log('Solicitud POST exitosa:', response);
                }
            } catch (error) {
                console.error('Error al enviar la solicitud POST:', error);
            }
        });
    });
});