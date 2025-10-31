const Article = require('../models/Article');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all articles
const getArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, author } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    author,
  };

  const result = await Article.getAll(filters);

  res.json({
    success: true,
    message: 'Articles retrieved successfully',
    data: {
      articles: result.articles,
      pagination: result.pagination,
    },
  });
});

// Get article by ID
const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article not found',
    });
  }

  res.json({
    success: true,
    message: 'Article retrieved successfully',
    data: {
      article,
    },
  });
});

// Get recent articles
const getRecentArticles = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const articles = await Article.getRecent(parseInt(limit));

  res.json({
    success: true,
    message: 'Recent articles retrieved successfully',
    data: {
      articles,
    },
  });
});

// Get featured articles
const getFeaturedArticles = asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;

  const articles = await Article.getFeatured(parseInt(limit));

  res.json({
    success: true,
    message: 'Featured articles retrieved successfully',
    data: {
      articles,
    },
  });
});

// Create article (Admin only)
const createArticle = asyncHandler(async (req, res) => {
  const {
    user_id,
    article_title,
    article_short_description,
    article_img,
    article_content,
    author,
    published_date,
  } = req.body;

  // Validate required fields
  if (!article_title || !article_content) {
    return res.status(400).json({
      success: false,
      message: 'Article title and content are required',
    });
  }

  const article = await Article.create({
    user_id,
    article_title,
    article_short_description,
    article_img,
    article_content,
  });

  // Create article info if author is provided
  if (author) {
    await Article.createArticleInfo(
      article.id,
      author,
      published_date || new Date().toISOString().split('T')[0]
    );
  }

  // Get the complete article with info
  const completeArticle = await Article.findById(article.id);

  res.status(201).json({
    success: true,
    message: 'Article created successfully',
    data: {
      article: completeArticle,
    },
  });
});

// Update article (Admin only)
const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const article = await Article.findById(id);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article not found',
    });
  }

  const { author, published_date, ...articleData } = updateData;

  // Update article
  const updatedArticle = await Article.update(id, articleData);

  // Update article info if provided
  if (author !== undefined || published_date !== undefined) {
    await Article.updateArticleInfo(id, { author, published_date });
  }

  // Get the complete updated article
  const completeArticle = await Article.findById(id);

  res.json({
    success: true,
    message: 'Article updated successfully',
    data: {
      article: completeArticle,
    },
  });
});

// Delete article (Admin only)
const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article not found',
    });
  }

  await Article.delete(id);

  res.json({
    success: true,
    message: 'Article deleted successfully',
  });
});

module.exports = {
  getArticles,
  getArticleById,
  getRecentArticles,
  getFeaturedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
