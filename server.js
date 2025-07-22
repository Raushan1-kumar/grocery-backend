require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

// Middleware
const origin = process.env.NODE_ENV === 'production'
  ? 'https://grocery-frontend-bzg6.onrender.com'
  : 'http://localhost:5173/';

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.get('/for-cons',(req, res) => {
  res.status(200).send('For consumers');
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));