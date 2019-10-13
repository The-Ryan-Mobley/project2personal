module.exports = (sequelize, DataTypes) => {
  const reviews = sequelize.define("reviews", {
    reviewRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    reviewParagraph: {
      type: DataTypes.STRING,
      len: [1, 600],
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
  reviews.associate = function(models) {
    reviews.belongsTo(models.users, {});
    reviews.belongsTo(models.beers, {});
  };
  return reviews;
};
