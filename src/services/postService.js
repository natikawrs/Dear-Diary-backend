const { Diary, User } = require("../models");

exports.findAllPosts = async (userId) => {
  const posts = await Diary.findAll({
    where: { userId },
    attributes: { exclude: "userId" },
    include: [{ model: User, attributes: { exclude: "password" } }],
    order: [["updatedAt", "DESC"]]
  });
  return posts;
};

exports.findPost = async (userId, postId) => {
  // console.log(userId);
  console.log(postId);
  const posts = await Diary.findOne({
    where: { userId, id: postId },
    attributes: { exclude: "userId" }
  });
  // const posts = await Diary.findOne({ where: { userId: 1, id: postId } });
  // console.log(posts);
  return posts;
};
