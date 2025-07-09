import Joi from 'joi';

// Regex patterns
const user_idRegex =/^@[a-zA-Z0-9_]{3,20}$/;

// admin_Signup validator
const adminSignupValidator = Joi.object({
  user_id: Joi.string()
    .pattern(user_idRegex)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user id format',
      'string.empty': 'user id is required',
    }),

  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Name is required',
  }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

// admin_Login validator
const adminLoginValidator = Joi.object({
  user_id: Joi.string()
    .pattern(user_idRegex)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Enrollment format',
      'string.empty': 'Enrollment is required',
    }),
    
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

// Validation functions
export function validateAdminSignup(adminData) {
  return adminSignupValidator.validate(adminData, { abortEarly: false });
}

export function validateAdminLogin(adminData) {
  return adminLoginValidator.validate(adminData, { abortEarly: false });
}
