const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Sample data (in-memory)
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1200 },
  { id: 2, name: 'Smartphone', category: 'Electronics', price: 800 },
  { id: 3, name: 'Headphones', category: 'Accessories', price: 150 },
  { id: 4, name: 'Shoes', category: 'Fashion', price: 100 },
  { id: 5, name: 'Watch', category: 'Fashion', price: 300 }
];

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Default route to serve the UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// API endpoint to get product by ID
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

// API endpoint to search for products based on query parameters
app.get('/search', (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let filteredProducts = products;

  // Filter by name
  if (name) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.price <= parseFloat(maxPrice)
    );
  }

  res.json(filteredProducts);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
