module.exports = (sequelize, DataTypes) => {
  const Diary = sequelize.define(
    "Diary",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      mood: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      image: DataTypes.STRING
    },

    { underscored: true }
  );

  Diary.associate = (db) => {
    Diary.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
  };

  return Diary;
};
