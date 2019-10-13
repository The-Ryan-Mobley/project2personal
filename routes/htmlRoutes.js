var db = require("../models");
const controller = require("./controller/controllerFunctions");
module.exports = function (app) {
  // Load index page
  // Access the session as req.session
  let controlFunctions = new controller(db);

  app.get("/", function (req, res) {
    if (req.session.userId) {
      let user = {
        userName: req.session.userName,
        userId: req.session.userId
      };
      if (req.session.userRole === "admin") {
        res.render("admin", {
          msg: "Welcome admin",
          msgTwo: "Search for beers to rate and review",
          user: user
        });
      } else {
        res.render("index", {
          msg: "Welcome to H-town Brews!",
          msgTwo: "Search for beers to rate and review",
          user: user
        });
      }
    } else {
      res.render("index", {
        msg: "Welcome to H-town Brews!",
        msgTwo: "Login to rate and review or browse the local beers as a guest",
        user: null
      });
    }
  });

  // display search results
  app.get("/results/:searchTerm?", function (req, res) {
    let search = req.params.searchTerm;
    db.beers
      .findAll({
        where: {
          [db.Op.or]: [
            { beer_name: { [db.Op.like]: search } },
            { beer_type: { [db.Op.like]: search } },
            { brewrey: { [db.Op.like]: search } }
          ]
        }
      })
      .then(results => {
        const beerPromise = results.map(beer => {
          return db.reviews
            .findAll({
              where: { beerId: beer.dataValues.id },
              include: [
                {
                  model: db.users
                }
              ]
            })
            .then(rev => {
              return {
                beer: beer,
                reviews: rev
              };
            });
        });

        Promise.all(beerPromise).then(beers => {
          let user = null;
          if (req.session.userId) {
            user = {
              userName: req.session.userName,
              userId: req.session.userId
            };
          }
          res.render("search-results", {
            data: beers,
            user: user
          });
        });
      });
  });
  //Profile Page
  app.get("/user/:username?", function (req, res) {
    let user = null;
    if (req.session.userId) {
      user = {
        userName: req.session.userName,
        userId: req.session.userId
      };
      db.users
        .findOne({
          where: { id: user.userId },
          include: [
            {
              model: db.reviews,
              include: [{ model: db.beers }]
            }
          ]
        })
        .then(result => {
          let date = result.createdAt.toDateString();
          res.render("profile-page", {
            user: user,
            data: result.reviews,
            userDate: date
          });
        });
    } else {
      res.render("index", {
        msg: "Welcome to Htown Brews",
        msgTwo: "Login to rate and review or browse the local beers as a guest",
        user: user
      });
    }
  });
  // Signup Page
  app.get("/signup", function (req, res) {
    if (req.session.userId) {
      let user = {
        userName: req.session.userName,
        userId: req.session.userId
      };
      res.render("signup", {
        user: user
      });
    } else {
      res.render("signup", {
        user: null
      });
    }
  });
  //beer page repurposed example function to query an individual beer from db then load its info and reviews
  app.get("/beer/:id", (req, res) => {
    controlFunctions.beerById(req.params.id, result => {
      if (req.session.userId) {
        let user = {
          userName: req.session.userName,
          userId: req.session.userId
        };
        res.render("beerReviews", {
          beer: result,
          user: user
        });
      } else {
        res.render("beerReviews", {
          beer: result,
          user: null
        });
      }
    });
  });
  app.get("/admin/addBeer", (req, res) => {
    if ((req.session.userRole = "admin")) {
      res.render("addBeer", { user: req.session.userName });
    } else {
      if (req.session.userId) {
        let user = {
          userName: req.session.userName,
          userId: req.session.userId
        };
        res.render("index", {
          msg: "Welcome to H-town Brews!",
          msgTwo: "Search for beers to rate and review",
          user: user
        });
      } else {
        res.render("index", {
          msg: "Welcome to H-town Brews!",
          msgTwo:
            "Login to rate and review or browse the local beers as a guest",
          user: null
        });
      }
    }
  });
  app.get("/admin/removeBeer", (req, res) => {
    let user = {
      userName: req.session.userName,
      userId: req.session.userId
    };
    if (req.session.userRole === "admin") {
      res.render("deleteBeer", { user: user });
    } else {
      if (req.session.userId) {
        res.render("index", {
          msg: "Welcome to H-town Brews!",
          msgTwo: "Search for beers to rate and review",
          user: user
        });
      } else {
        res.render("index", {
          msg: "Welcome to H-town Brews!",
          msgTwo:
            "Login to rate and review or browse the local beers as a guest",
          user: null
        });
      }
    }
  });
  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("index", {
      msg: "Welcome to H-town Brews!",
      msgTwo: "Login to rate and review or browse the local beers as a guest",
      user: null
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    let user = {
      userName: req.session.userName,
      userId: req.session.userId
    };
    if (req.session.userId) {
      res.render("404", {
        user: user
      });
    } else {
      res.render("404", {
        user: null
      });
    }
  });
};
