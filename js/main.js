// Function to change the main product image when a thumbnail is clicked
function changeImage(thumb) {
    const mainImage = document.getElementById("main-image");
    mainImage.src = thumb.src; // Update main image source with clicked thumbnail's source
}

// Retrieve cart from localStorage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update cart icon in the navbar
function updateCartIcon() {
    const cartIcon = document.getElementById("cart-badge");
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount > 0) {
        cartIcon.textContent = cartCount; // Show the number of items
        cartIcon.style.display = "block";  // Ensure the badge is visible
    } else {
        cartIcon.textContent = '';        // Hide the number if cart is empty
        cartIcon.style.display = "none";  // Hide the badge
    }
}

// Function to save the cart to localStorage
function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to find a product in the cart by its ID
function findCartItem(productId) {
    return cart.find(item => item.id === productId);
}

// Add to Cart button functionality
document.getElementById("add-to-cart-btn").addEventListener("click", function () {
    const productId = "12345"; // Replace with actual product ID
    const productName = document.getElementById("product-name").textContent;
    const productPrice = document.getElementById("product-price").textContent;
    const productImage = document.getElementById("main-image").src; // Get the main product image
    const quantityElement = document.getElementById("quantity");
    
    let cartItem = findCartItem(productId);
    if (cartItem) {
        // If product already exists in the cart, increase the quantity
        cartItem.quantity += 1;
    } else {
        // If not, add it to the cart
        cartItem = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice.replace('$', '')), // Remove $ and convert to number
            image: productImage, // Add the product image URL
            quantity: 1
        };
        cart.push(cartItem);
    }
    
    // Update UI and cart icon
    quantityElement.textContent = cartItem.quantity;
    updateCartIcon();
    
    // Show the increment/decrement buttons
    document.getElementById("increment-btns").classList.remove("d-none");

    // Save the updated cart to localStorage
    saveCartToStorage();
});

// Increment button functionality
document.getElementById("increase-btn").addEventListener("click", function () {
    const productId = "12345"; // Replace with actual product ID
    const quantityElement = document.getElementById("quantity");
    
    let cartItem = findCartItem(productId);
    if (cartItem) {
        cartItem.quantity += 1;
        quantityElement.textContent = cartItem.quantity;
        updateCartIcon(); // Update the cart icon
    }

    // Save the updated cart to localStorage
    saveCartToStorage();
});

// Decrement button functionality
document.getElementById("decrease-btn").addEventListener("click", function () {
    const productId = "12345"; // Replace with actual product ID
    const quantityElement = document.getElementById("quantity");
    
    let cartItem = findCartItem(productId);
    if (cartItem) {
        cartItem.quantity -= 1;
        
        // If quantity reaches 0, remove item from cart and hide increment buttons
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId); // Remove the item from cart
            document.getElementById("increment-btns").classList.add("d-none");
        } else {
            quantityElement.textContent = cartItem.quantity;
        }
        
        // Update UI and cart icon
        updateCartIcon();
    }

    // Save the updated cart to localStorage
    saveCartToStorage();
});

// Update cart contents and icon when the page loads
window.addEventListener("load", function() {
    updateCartIcon();
});
