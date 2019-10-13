module.exports = function(db) {
  const crypto = require("crypto");
  this.searchBeers = async (keyword, callback) => {
    results = await db.beers.findAll({
      where: {
        beer_name: { $like: keyword }
      }
    });
    callback(results);
  };
  this.beerById = async (beerId, callback) => {
    results = await db.beers.findOne({
      where: {
        id: beerId
      }
    });
    callback(results);
  };
  this.addBeer = async (beerObj, callback) => {
    results = await db.beers.create({
      beer_name: beerObj.name,
      beer_type: beerObj.type,
      beer_description: beerObj.description,
      brewrey: beerObj.brewrey
    });
    callback(results);
  };
  this.deleteBeer = async (beerId, callback) => {
    results = await db.beers.destroy({
      where: { id: beerId }
    });
    callback(result);
  };
  this.beerReviews = async (beerId, callback) => {
    //lists reviews by beer id
    let result = await db.reviews.findAll({
      where: {
        beerId: beerId
      }
    });
    callback(result);
  };
  this.addReview = async (reviewObj, callback) => {
    let result = await db.reviews.create({
      reviewRating: reviewObj.rating,
      reviewParagraph: reviewObj.paragraph,
      beerId: reviewObj.beerId,
      userId: reviewObj.userId
    });
    callback(result);
  };
  this.newProfilePic = async (userObj, callback) => {
    let result = await db.users.update(
      {
        profileUrl: userObj.newUrl
      },
      {
        where: {
          id: userObj.userId
        }
      }
    );
    if (result) {
      callback(result);
    } else {
      callback("404");
    }
  };
  this.findAuthor = async (authorId, callback) => {
    let result = await db.users.findOne({
      where: {
        id: authorId
      },
      attributes: ["username", "profileUrl"]
    });
    if (result) {
      callback(result);
    } else {
      callback("404");
    }
  };
  this.calcRating = async (beerID, callback) => {
    let beerResult = await db.beers.findOne({
      where: {
        id: beerID
      },
      attributes: ["avg_rating"]
    });
    if (beerResult) {
      let beerReviewScores = await db.reviews.findAll({
        where: {
          beerId: beerID
        },
        attributes: ["reviewRating"]
      });
      if (beerReviewScores) {
        let scoreArr = [];
        scoreArr.push(beerResult.dataValues.avg_rating);
        beerReviewScores.forEach(i => {
          scoreArr.push(i.dataValues.reviewRating);
        });
        let ratingSum = scoreArr.reduce((total, currentValue) => {
          return total + currentValue;
        });
        ratingSum /= scoreArr.length;
        let finalPush = await db.beers.update(
          {
            avg_rating: ratingSum
          },
          {
            where: {
              id: beerID
            }
          }
        );
        callback(finalPush);
      }
    }
  };
  //***************************************************password validation**************************************************** */
  this.getSalt = async username => {
    let result = await db.users.findOne({
      where: { userName: username },
      attributes: ["salt"]
    });
    if (result) {
      return result.dataValues.salt;
    } else {
      return undefined;
    }
  };
  this.genRandomString = length => {
    //makes the hash salt
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex") /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  };
  this.sha512 = (password, salt) => {
    let hash = crypto.createHmac(
      "sha512",
      salt
    ); /** Hashing algorithm sha512 */
    hash.update(password.toString());
    let value = hash.digest("hex");
    return {
      salt: salt,
      passwordHash: value
    };
  };
  this.newUserQuery = async (req, res, callback) => {
    //hashes the password then stores user values and salt in DB
    let newUser = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: "guest"
    };
    let Salt = this.genRandomString(16); /** Gives us salt of length 16 */
    let passwordData = this.sha512(newUser.password, Salt);
    let result = await db.users.create({
      userName: newUser.username,
      email: newUser.email,
      password: passwordData.passwordHash,
      role: "guest",
      salt: passwordData.salt
    });

    if (result) {
      callback(result);
    } else {
      callback("404");
    }
  };
  /*****************************************************Check Sessions*****************************************************/
  this.login = async (req, callback) => {
    const post = req.body;
    let userSalt = await this.getSalt(post.userName);
    if (userSalt === undefined) {
      callback("404");
    } else {
      let name = post.userName;
      let pass = this.sha512(post.password, userSalt);
      let results = await db.users.findOne({
        where: {
          userName: name,
          password: pass.passwordHash
        },
        attributes: ["id", "userName", "role"]
      });
      if (results) {
        let userData = {
          userName: results.dataValues.userName,
          userID: results.dataValues.id,
          userRole: results.dataValues.role
        };
        if (userData.userID === null) {
          callback("404");
          return;
        } else {
          callback(userData);
        }
      } else {
        callback("404");
      }
    }
  };
};
