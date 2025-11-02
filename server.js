require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Connect to the database
connectDB();

const app = express();

// --- START: FINAL CORS CONFIGURATION ---
// This array lists all the frontend URLs that are allowed to make requests to this backend.
const allowedOrigins = [
  process.env.CLIENT_URL, // The live Vercel URL from Render's environment variables
  'http://localhost:5173'  // The URL for local development
];

const corsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the site making the request (e.g., your Vercel site).
    // We check if this origin is in our list of allowed origins.
    // The '!origin' part allows requests that don't have an origin (like Postman).
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  }
};

app.use(cors(corsOptions));
// --- END: FINAL CORS CONFIGURATION ---


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