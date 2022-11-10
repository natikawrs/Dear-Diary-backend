const express = require("express");

const postController = require("../controllers/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.route("/").post(upload.single("image"), postController.createPost);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(upload.single("image"), postController.updatePost)
  .delete(postController.deletePost);

router.delete("/diaryImg/:id", postController.deleteDiaryImg);

module.exports = router;
