const fs = require("fs");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");
const { User } = require("../models");

exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...updateValue } = req.body;

    if (req.files.profileImage) {
      const profileImage = req.user.profileImage;

      const secureUrl = await cloudinary.upload(
        req.files.profileImage[0].path,
        profileImage ? cloudinary.getPublicId(profileImage) : undefined
      );

      updateValue.profileImage = secureUrl;
      fs.unlinkSync(req.files.profileImage[0].path);

      const hashedPassword = await bcrypt.hash(password, 12);

      await User.update(
        { ...updateValue, password: hashedPassword },
        {
          where: { id: req.user.id }
        }
      );
    } else {
      const { userName, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      await User.update(
        { userName, password: hashedPassword },
        {
          where: { id: req.user.id }
        }
      );
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: "password" }
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.deleteProfileImg = async (req, res, next) => {
  // const { profileImage } = req.body;
  try {
    // if (req.files.profileImage) {
    //   const profileImage = req.user.profileImage;

    //   const secureUrl = await cloudinary.upload(
    //     req.files.profileImage[0].path,
    //     profileImage ? cloudinary.getPublicId(profileImage) : undefined
    //   );

    //   updateValue.profileImage = secureUrl;
    // fs.unlinkSync(req.files.profileImage[0].path);
    // }

    const user = await User.update(
      { profileImage: null },
      {
        where: { id: req.user.id }
      }
    );
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
