require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product');

const app = express();

// Middleware
const origin = process.env.NODE_ENV === 'production'
  ? 'https://grocery-frontend-bzg6.onrender.com'
  : 'http://localhost:5173/';

app.use(cors());

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/users', require('./routes/userRoutes'));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));