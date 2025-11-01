const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { path: String, filename: String },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  tags: [{ type: String }],
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;