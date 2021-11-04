const BaseJoi = require('joi'),
    sanitizeHtml = require('sanitize-html');

// Method for sanitizing html. Helps prevent cross site scripting.
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    // nothing is allowed through if html used
                    allowedTags: [],
                    allowedAttributes: {},
                });
                // compares original and sanitized, if something is removed notify html is not allowed
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension);

// JOI SCHEMAS - these prevent server side requests bypassing client side validation
module.exports.thingstodoSchema = Joi.object({
    thingstodo: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        tour: Joi.string().required().escapeHTML(),
        image: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
review: Joi.object({
    title: Joi.string().required().escapeHTML(),
    rating: Joi.number().required(),
    body: Joi.string().required().escapeHTML(),
    }).required()
});