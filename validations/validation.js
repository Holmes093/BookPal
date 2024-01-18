// Code is mostly sampled from my Cloud Computing Coursework

const joi = require('joi');

/**
 * Validates registration data against a predefined schema.
 * @param {object} data - The user data to validate.
 * @returns {object} - The result of joi validation.
 */
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(), // Ensure format is an email.
        password: joi.string().required().min(6).max(1024), // Ensure password is at least 6 characters.
        location: joi.string().required(),
        age: joi.number().integer().min(0).required()
    });
    return schemaValidation.validate(data);
}

/**
 * Validates login data against a predefined schema.
 * @param {object} data - The user data to validate.
 * @returns {object} - The result of joi validation.
 */
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(), // Ensure format is an email.
        password: joi.string().required().min(6).max(1024) // Ensure password is at least 6 characters.
    });
    return schemaValidation.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;