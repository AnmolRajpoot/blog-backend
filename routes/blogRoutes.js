const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getMyBlogs } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getBlogs).post(protect, upload.single('image'), createBlog);
router.get('/myblogs', protect, getMyBlogs);
router.route('/:id').get(getBlogById).put(protect, upload.single('image'), updateBlog).delete(protect, deleteBlog);

module.exports = router;