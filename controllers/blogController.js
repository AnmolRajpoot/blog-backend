const Blog = require('../models/blogModel');
const { cloudinary } = require('../config/cloudinary');

const getBlogs = async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const { search, tag } = req.query;

  let query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (tag) query.tags = tag;

  try {
    const count = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).populate('author', 'name').sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1));
    res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'name');
  if (blog) res.json(blog);
  else res.status(404).json({ message: 'Blog not found' });
};

const createBlog = async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

  const blog = new Blog({
    title,
    content,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    author: req.user._id,
  });

  if (req.file) {
    blog.featuredImage = { path: req.file.path, filename: req.file.filename };
  }

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
};

const updateBlog = async (req, res) => {
  const { title, content, tags } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    if (blog.author.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    if (req.file) {
      if (blog.featuredImage && blog.featuredImage.filename) await cloudinary.uploader.destroy(blog.featuredImage.filename);
      blog.featuredImage = { path: req.file.path, filename: req.file.filename };
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    if (blog.author.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    if (blog.featuredImage && blog.featuredImage.filename) await cloudinary.uploader.destroy(blog.featuredImage.filename);

    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

const getMyBlogs = async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
  res.json(blogs);
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getMyBlogs };