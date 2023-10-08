const socket = io()

socket.on('AllProductsCart', (data) => {
    updateProductCartList(data);
});


// Función para actualizar la lista de productos disponibles en el carrito en mi página web
function updateProductCartList(productList) {
    const cartDiv = document.getElementById("cartProducts");
    let contenidocambiante = ""

    productList.docs.forEach(({ thumbnail,  _id, code,category, title }) => {
        contenidocambiante += `<div class="form-container">
            <div>
                <div class="card">
                    <img src= "${thumbnail}" alt="..." class="images">
                    <div class="card-body">
                        Title: ${title} </br> 
                        Id: ${_id} </br> 
                        Code: ${code}</br> 
                        Category: ${category}</br> 
                        <button id="btn-catalogo-${_id}" class="btn btn-success">Agregar</button>
                    </div>
                </div>
            </div>
        </div>`

    });

    cartDiv.innerHTML = contenidocambiante
}




