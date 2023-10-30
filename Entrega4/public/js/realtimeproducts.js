const socket = io();

//Plantilla de ejecucion de tarjeta de producto
const productCardTemplate = Handlebars.compile(`
    <article id="{{code}}">
        <header class="title">{{title}}</header>
        <div class="description">{{description}}.</div>
        <div class="grid">
            {{#each thumbnails}}
            <div class="thumbnails_img">
                <img src="{{this}}" alt="{{title}} {{@index}}"><br>
            </div>
            {{/each}}
        </div>
        <footer>
            $ {{price}}<br>
            There are {{stock}} units left.
        </footer>
    </article>
`);

socket.on('productAdded', (product) => {

    const newProductCard = productCardTemplate(product);

    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML += newProductCard;
});

socket.on('productDeleted', (code) =>{
    const productToDelete = document.getElementById(code);
    if (productToDelete){
        productToDelete.remove();
    } else {
        console.log('The product to delete was not found')
    }
});