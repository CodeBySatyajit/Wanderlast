const Joi = require('joi');
const { create } = require('./models/listing');

//handel validation using joi

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().required().valid("Trending", "Beach", "Mountain", "Rooms", "Castle", "City", "Camping", "Farm", "Arctic", "Amazing Pools"),
    image: Joi.string().allow("", null),
  })
    .required(),

});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
