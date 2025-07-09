import Joi from 'joi';

// Regex patterns
const enrollmentRegex =/^(0704|0714)(CS|IT|AD)(20|21|22|23|24|25|26)(1[0-2][0-9]{2}|1300)$/;
const mobileRegex = /^[6-9]\d{9}$/;

// Signup validator
const signupValidator = Joi.object({
  enrollment: Joi.string()
    .pattern(enrollmentRegex)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Enrollment format',
      'string.empty': 'Enrollment is required',
    }),

  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Name is required',
  }),

  mobile: Joi.string()
    .pattern(mobileRegex)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Mobile number',
      'string.empty': 'Mobile number is required',
    }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),

  status: Joi.string().valid('active', 'inactive').default('active'),

  security_question: Joi.string().min(1).required().messages({
    'string.empty': 'Security question is required',
  }),

  security_answer: Joi.string().min(1).required().messages({
    'string.empty': 'Security answer is required',
  }),
});

// Login validator
const loginValidator = Joi.object({
  enrollment: Joi.string()
    .pattern(enrollmentRegex)
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
export function validateSignup(userData) {
  return signupValidator.validate(userData, { abortEarly: false });
}

export function validateLogin(userData) {
  return loginValidator.validate(userData, { abortEarly: false });
}
