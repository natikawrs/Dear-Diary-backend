const fs = require("fs");
const AppError = require("../utils/appError");
const cloudinary = require("../utils/cloudinary");
const { Diary, User } = require("../models");
const postService = require("../services/postService");

exports.createPost = async (req, res, next) => {
  try {
    const { date, mood, title, content } = req.body;

    // if (
    //   ((!date ||
    //     !mood ||
    //     !title ||
    //     !title.trim() ||
    //     !content ||
    //     !content.trim()) &&
    //     !date) ||
    //   !mood ||
    //   !title ||
    //   !title.trim() ||
    //   !content ||
    //   !content.trim() ||
    //   !req.file
    // ) {
    //   throw new AppError("content or image is required", 400);
    // }

    const data = { userId: req.user.id };
    if (date) {
      data.date = date;
    }
    if (mood) {
      data.mood = mood;
    }
    if (title && title.trim()) {
      data.title = title;
    }
    if (content && content.trim()) {
      data.content = content;
    }
    if (req.file) {
      data.image = await cloudinary.upload(req.file.path);
    }

    const newPost = await Diary.create(data);
    const post = await Diary.findOne({
      where: { id: newPost.id },
      attributes: { exclude: "userId" },
      include: [{ model: User }]
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    // console.log("CHECK POINTTTTTT");
    const { ...updateValue } = req.body;
    const { id } = req.params;

    if (req.file) {
      const image = req.file.path;

      const secureUrl = await cloudinary.upload(
        req.file.path,
        image ? cloudinary.getPublicId(image) : undefined
      );

      updateValue.image = secureUrl;
      fs.unlinkSync(req.file.path);

      const result = await Diary.update(
        { ...updateValue },
        {
          where: { id }
        }
      );
      console.log(result);
    } else {
      const { date, mood, title, content } = req.body;

      const result = await Diary.update(
        { date, mood, title, content },
        {
          where: { id }
        }
      );
      console.log(result);
    }

    const user = await Diary.findOne({
      where: { id }
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const userId = +req.params.id;
    const posts = await postService.findAllPosts(userId);
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const userId = +req.user.id;
    // console.log(req.params);

    const postId = +req.params.id;
    const posts = await postService.findPost(userId, postId);
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Diary.findOne({ where: { id: req.params.id } });
    if (!post) {
      throw new AppError("post was not found", 400);
    }
    if (req.user.id !== post.userId) {
      throw new AppError("no permission to delete", 403);
    }

    await post.destroy();
    res.status(200).json({ message: "success delete" });
  } catch (err) {
    // await t.rollback();
    next(err);
  }
};

exports.deleteDiaryImg = async (req, res, next) => {
  try {
    const user = await Diary.update(
      { image: null },
      {
        // where: { id: req.params.id }
        where: { id: req.params.id }
      }
    );
    res.status(200).json({ message: "deleted successful" });
  } catch (err) {
    next(err);
  }
};
