const Comment = require('../models/comment.model');

exports.create = async (data) => {
  const comment = new Comment(data);
  return await comment.save();
};

exports.getByProduct = async (productId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    Comment.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Comment.countDocuments({ productId })
  ]);
  return {
    comments,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
};
