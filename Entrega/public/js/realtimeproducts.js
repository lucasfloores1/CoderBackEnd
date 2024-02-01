const socket = io();

//Plantilla de ejecucion de tarjeta de producto
const productCardTemplate = Handlebars.compile(`
    <div class="col" id="{{this.code}}">
        <div class="card text-bg-secondary">
            <div id="productCarousel{{@index}}" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                    {{#each this.thumbnails}}
                    {{#if @first}}
                    <div class="carousel-item active">
                        <img src="{{this}}" class="d-block w-100" alt="{{../title}} {{@index}}">
                    </div>
                    {{else}}
                    <div class="carousel-item">
                        <img src="{{this}}" class="d-block w-100" alt="{{../title}} {{@index}}">
                    </div>
                    {{/if}}
                    {{/each}}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel{{@index}}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#productCarousel{{@index}}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <div class="card-body">
                <h5 class="card-title">{{this.title}}</h5>
                <p class="card-text" class="price">$ {{this.price}}</p>
                <p class="card-text">{{this.description}}</p>
                <a href="#" class="btn btn-primary">Add to cart</a>
            </div>
        </div>
    </div>
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