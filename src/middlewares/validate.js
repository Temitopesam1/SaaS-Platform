function validateBody(schema) {
    return function (req, res, next) {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          error: 'Invalid request',
          details: error.details.map(d => d.message)
        });
      }
      next();
    };
  }
  
  module.exports = { validateBody };
  