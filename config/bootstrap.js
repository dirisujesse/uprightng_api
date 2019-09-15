/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var products = [
  {
    name: "Face Cap",
    points: 500,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568466475/caps.png",
    rating: 4.3,
  },
  {
    name: "Shirts",
    points: 700,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465082/shirts.png",
    rating: 4.3,
  },
  {
    name: "Wristbands",
    points: 100,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465082/wristband.png",
    rating: 4.5,
  },
  {
    name: "Water Bottles",
    points: 3000,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465077/flask.png",
    rating: 4,
  },
  {
    name: "Media Appearance",
    points: 20000,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465080/media_appearance.png",
    rating: 5,
  },
  {
    name: "Umbrella",
    points: 700,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465078/umbrella.png",
    rating: 4.1,
  },
  {
    name: "Bluetooth Speaker",
    points: 900,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465081/speaker.png",
    rating: 4.9,
  },
  {
    name: "Notepads",
    points: 1000,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465079/jotter.png",
    rating: 4.7,
  },
  {
    name: "Anti-Corruption Message Pack",
    points: 10000,
    image: "https://res.cloudinary.com/jesse-dirisu/image/upload/v1568465082/upright_bonus.png",
    rating: 5,
  }
]

module.exports.bootstrap = function (cb) {
  Product.count().exec(function (err, count) {
    if (err) {
      return;
    }
    if (count) {
      console.log(count);
    } else {
      Product.create(products).exec(function (err, items) {
        if (err) {
          return;
        }
        console.dir(items);
      })
    }

  })
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
