/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛡️ CENTRALIZED ERROR HANDLING MIDDLEWARE
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PRINCIPLE: The Safety Net (Four-Argument Arity Pattern)
 * 
 * In Express, functions are inspected using JavaScript's `fn.length` property.
 * When Express sees a middleware with EXACTLY 4 parameters: `(err, req, res, next)`,
 * it marks this function as a SPECIAL ERROR HANDLER in the internal pipeline.
 * 
 * If a developer omits the 4th argument and writes `(err, req, res)`, Express
 * treats it as a standard route handler and the app will CRASH or HANG.
 * 
 * This file replaces Spring Boot's `@RestControllerAdvice` + `@ExceptionHandler`.
 */

// 404 Handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  // If status code is 200, default to 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose Bad ObjectId (CastError) -> e.g. /api/products/invalid-id
  let message = err.message;
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found: invalid ID format';
  }

  // Handle Mongoose Duplicate Key Error (e.g., duplicate email during registration)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Handle Mongoose Validation Error (e.g. missing required field)
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
