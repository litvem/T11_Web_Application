const session = require("express-session")

require("dotenv").config()

module.exports = session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 3_600_000 }, // 1 hour
    rolling: true, // Refresh expiration on reload
    resave: false,
    saveUninitialized: false // Set to true upon user login
})