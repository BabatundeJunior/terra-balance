// // Function to change the main product image when a thumbnail is clicked
function changeImage(thumb) {
    const mainImage = document.getElementById("main-image");
    mainImage.src = thumb.src; // Update main image source with clicked thumbnail's source
}

// Fetch and display products
fetch('data/products.json')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check if the data loads correctly
    displayProducts(data);
  })
  .catch(error => console.error('Error loading JSON:', error));

// Function to display products on the page
function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  products.forEach(product => {
    const productCard = `
      <div class="card" style="width: 18rem;">
        <img src="${product.main_image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <h6>${product.price}</h6>
          <a href="detail.html?id=${product.id}" class="btn bt-sec">View Details</a>
        </div>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });
}

function loadProductDetails(productId) {
    fetch('data/products.json') // Ensure the correct path
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
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
        
  
        // Load related products
        const relatedProductsContainer = document.getElementById('related-products');
        relatedProductsContainer.innerHTML = '';
        products
          .filter(p => p.id !== productId)
          .slice(0, 3)
          .forEach(related => {
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
      })
      .catch(error => console.error('Error loading product details:', error));
  }
  