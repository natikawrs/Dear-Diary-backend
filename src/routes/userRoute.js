const express = require("express");

const upload = require("../middlewares/upload");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

const router = express.Router();

router.patch(
  "/",
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  userController.updateUser
);

router.delete("/profileImg", userController.deleteProfileImg);

router.get("/:id/posts", postController.getAllPosts);

module.exports = router;
