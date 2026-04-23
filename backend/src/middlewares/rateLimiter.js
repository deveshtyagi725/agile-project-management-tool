import rateLimit from 'express-rate-limit'

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // raised from 100 — normal app use easily hits 100 on a single page load
  skip: (req) => req.path.startsWith('/auth'), // auth endpoints are already protected by bcrypt cost
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export default rateLimiter
