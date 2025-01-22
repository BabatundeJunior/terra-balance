// Function to change the main product image when a thumbnail is clicked
function changeImage(thumb) {
  const mainImage = document.getElementById("main-image");
  mainImage.src = thumb.src; // Update main image source with clicked thumbnail's source
}

// Function to fetch and display related products and cart updates
function loadProductDetails(productId) {
  fetch('data/products.json') // Ensure the correct path to your JSON file
    .then(response => response.json())
    .then(products => {
      console.log("Products data loaded:", products);
      const product = products.find(p => p.id === productId);
      if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
      }

      // Set main product details
      document.getElementById('main-image').src = product.main_image;
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-description').textContent = product.description;
      document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;

      // Load thumbnails
      const thumbnailContainer = document.getElementById('thumbnail-container');
      thumbnailContainer.innerHTML = ''; // Clear existing thumbnails
      if (product.variant_images && product.variant_images.length > 0) {
        product.variant_images.forEach(image => {
          console.log('Rendering variant image:', image); // Debugging
          const thumbnail = document.createElement('img');
          thumbnail.src = image;
          thumbnail.alt = `Thumbnail for ${product.name}`;
          thumbnail.className = 'thumb-image';
          thumbnail.onclick = () => changeImage(thumbnail);
          thumbnailContainer.appendChild(thumbnail);
        });
      } else {
        console.warn('No variant images found for product:', product.id);
      }

      // Add to Cart Button functionality
      setupAddToCartButton(product);

      // Load related products
      loadRelatedProducts(products, productId);
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
}

// Function to load related products
function loadRelatedProducts(products, productId) {
  const relatedProductsContainer = document.getElementById('related-products');
  relatedProductsContainer.innerHTML = ''; // Clear existing related products

  // Filter products that are not the current product
  const relatedProducts = products.filter(p => p.id !== productId).slice(0, 3);

  relatedProducts.forEach(related => {
    const relatedCard = `
      <div class="col-md-3">
        <div class="card">
          <img src="${related.main_image}" class="card-img-top" alt="${related.name}">
          <div class="card-body">
            <p class="card-text">${related.name}</p>
            <button class="btn btn-custom" onclick="loadProductDetails(${related.id})">View</button>
          </div>
        </div>
      </div>
    `;
    relatedProductsContainer.innerHTML += relatedCard;
  });
}

// Function to update the cart icon (for the navbar/cart badge)
function updateCartIcon() {
  const cartIcon = document.getElementById("cart-badge");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cartCount > 0) {
    cartIcon.textContent = cartCount;
    cartIcon.style.display = "block"; // Show badge
  } else {
    cartIcon.textContent = '';
    cartIcon.style.display = "none"; // Hide badge
  }
}

// Function to setup add to cart button
function setupAddToCartButton(product) {
  const addToCartButton = document.getElementById("add-to-cart-btn");

  // Retrieve cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Add to Cart button functionality
  addToCartButton.addEventListener("click", function () {
    let cartItem = cart.find((item) => item.id === product.id);

    if (cartItem) {
      // If product exists in the cart, increase quantity
      cartItem.quantity += 1;
    } else {
      // If product is not in the cart, add it
      cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image,
        quantity: 1,
      };
      cart.push(cartItem);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart icon in the navbar
    updateCartIcon();
        // Show success message
        if (successMessage) {
          successMessage.style.display = "block";  // Show success message
          setTimeout(() => {
            successMessage.style.display = "none"; // Hide after 2 seconds
          }, 2000);
        }
  });
}

// Function to remove an item from the cart
function removeItemFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== productId); // Remove item based on ID

  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
  updateCartIcon(); // Update cart icon with the new item count

  // Call renderCart to re-render the cart items list after removal
  renderCart();
}

// Function to render cart items
function renderCart() {
  const cartContainer = document.getElementById('cart-items-container');
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = ''; // Clear existing cart content

  // Check if cart is empty
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  // Render each cart item
  cart.forEach(item => {
    const cartItemHTML = `
      <div class="cart-item" id="cart-item-${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <h5>${item.name}</h5>
        <p>${item.price}</p>
        <button class="remove-item-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartContainer.innerHTML += cartItemHTML;
  });

  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.remove-item-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      removeItemFromCart(productId); // Remove item from cart
    });
  });
}

// Function to load and display all products
function loadProducts() {
  fetch('data/products.json')  // Ensure the path is correct
    .then(response => response.json())
    .then(products => {
      console.log("Products loaded:", products);

      const productsContainer = document.getElementById('products-container');
      if (!productsContainer) {
        console.error('Products container not found!');
        return;
      }

      products.forEach(product => {
        const productCard = `
          <div class="col-md-3">
            <div class="card">
              <img src="${product.main_image}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <h6>$${product.price.toFixed(2)}</h6>
                <a href="detail.html?id=${product.id}" class="btn bt-sec">View Details</a>
              </div>
            </div>
          </div>
        `;
        productsContainer.innerHTML += productCard;
      });
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
}

// Call loadProducts on page load
window.addEventListener('load', loadProducts);

// Call updateCartIcon on page load
window.addEventListener("load", updateCartIcon);

// Call renderCart on page load to display cart items
window.addEventListener("load", renderCart);
