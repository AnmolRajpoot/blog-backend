require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

connectDB();

const app = express();

// --- START: UPDATED CORS CONFIG ---
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));
// --- END: UPDATED CORS CONFIG ---


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ... rest of your server file ...
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));