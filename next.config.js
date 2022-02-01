/** @format */

module.exports = {
  env: {
    // NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    // API_URI: process.env.API_URI,
    PORT: process.env.PORT,

    CLOUDINARY_URL: process.env.CLOUDINARY_URL,

    // SMTP_HOST: process.env.SMTP_HOST,
    // SMTP_PORT: process.env.SMTP_PORT,
    // SMTP_USER: process.env.SMTP_USER,
    // SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    // SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    // SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,

    JWT_SECRET: process.env.JWT_SECRET,
    // STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};
