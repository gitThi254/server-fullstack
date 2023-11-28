const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const Blog = require("../models/blog.model");

exports.createBlog = asyncErrorHandler(async (req, res, next) => {
  const newBlogs = await Blog.create(req.body);
  res.json({
    data: newBlogs,
  });
});

exports.updateBlogs = asyncErrorHandler(async (req, res, next) => {
  const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updateBlog)
    return next(
      new CustomError(`Blog witth id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: updateBlog,
  });
});

exports.getBlog = asyncErrorHandler(async (req, res, next) => {
  const getBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );

  if (!getBlog)
    return next(
      new CustomError(`Blog witth id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: getBlog,
  });
});

exports.getallBlogs = asyncErrorHandler(async (req, res, next) => {
  const getBlogs = await Blog.find();
  res.json({
    data: getBlogs,
  });
});

exports.deleteBlogs = asyncErrorHandler(async (req, res, next) => {
  const deleteBlogs = await Blog.findByIdAndDelete(req.params.id);

  if (!deleteBlogs)
    return next(
      new CustomError(`Blog witth id : ${req.params.id} not found`, 404)
    );
  res.json({
    data: deleteBlogs,
  });
});

exports.likeBlog = asyncErrorHandler(async (req, res, next) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  if (!blog)
    return next(
      new CustomError(`Blog with id : ${req.body.blogId} not found`, 404)
    );
  const loginUserId = req?.user?._id;
  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

exports.disLikeBlog = asyncErrorHandler(async (req, res, next) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  if (!blog)
    return next(
      new CustomError(`Blog with id : ${req.body.blogId} not found`, 404)
    );
  const loginUserId = req?.user?._id;
  const isDisLiked = blog?.isDisliked;
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
