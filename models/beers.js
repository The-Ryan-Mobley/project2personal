module.exports = (sequelize, DataTypes) => {
  const beers = sequelize.define("beers", {
    beer_name: {
      type: DataTypes.STRING,
      len: [1, 75],
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    beer_type: {
      type: DataTypes.STRING,
      len: [1, 25],
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    beer_description: {
      type: DataTypes.TEXT,
      len: [1, 10000],
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    brewrey: {
      type: DataTypes.STRING,
      len: [1, 75],
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    avg_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    }
  });
  beers.associate = function (models) {
    beers.hasMany(models.reviews, {
      onDelete: "cascade"
    });
  };
  return beers;
};
