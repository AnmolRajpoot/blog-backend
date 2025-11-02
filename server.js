require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Connect to the database
connectDB();

const app = express();

// --- CORS Configuration ---
// This simple configuration is the most reliable.
// It tells the server to only accept requests from the URL
// defined in your CLIENT_URL environment variable on Render.
app.use(cors({ origin: process.env.CLIENT_URL }));

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// --- Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));