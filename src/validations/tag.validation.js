const Joi = require("joi");

function validateTagSchema(tagInput) {
  const Schema = Joi.object().keys({
    tagName: Joi.string().max(50).required(),
    tagDetails: Joi.string().optional(),
  });

  return Schema.validate(tagInput);
}

module.exports = {validateTagSchema};
