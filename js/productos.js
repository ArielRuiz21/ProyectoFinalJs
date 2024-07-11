let products = [];
let cart = loadCartFromLocalStorage();
const errorCarritoDiv = document.getElementById('error_carrito');
errorCarritoDiv.style.color = 'red';

function mandarMjeDeError(productId){
    errorCarritoDiv.innerHTML = `<p>Producto con ID: ${productId} no encontrado</p>`;    
}

function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        mandarMjeDeError(productId);
        return;
    }

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.totalPrice = cartItem.quantity * product.price;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            totalPrice: quantity * product.price
        });
    }

    saveCartToLocalStorage();
    renderCart();
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
                <p>${product.name} - $${product.price}</p>
                <img src="${product.image}" alt="${product.name}" style="width:100px;height:auto;">
                <button onclick="addToCart(${product.id}, 1)" class="button_grey">Agregar al Carrito</button>  
        `;
        productList.appendChild(productDiv);
        productList.addEventListener('click', () =>{
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Este producto a sido agregado al Carrito!",
                showConfirmButton: false,
                timer: 2000
              });
        })
    });
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.innerHTML = `
            <p>ID: ${item.id}, Nombre: ${item.name}, Cantidad: ${item.quantity}, Precio Total: $${item.totalPrice}</p>
            <button onclick="removeFromCart(${item.id})" class="button_red">Eliminar</button>
                `;

        
        cartDiv.appendChild(cartItemDiv);
        cartDiv.addEventListener('click',()=>{
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Producto Borrado del Carrito",
                showConfirmButton: false,
                timer: 2000
              });
        })
    });
}
function removeFromCart(productId) {
            
            cart = cart.filter(item => item.id !== productId);

          
            saveCartToLocalStorage();

            
            renderCart();
        }


function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
            renderCart();
        })
        .catch(error => console.error('Error cargando los productos:', error));
});