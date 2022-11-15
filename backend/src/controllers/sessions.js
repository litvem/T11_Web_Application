const express = require("express")
const router = express.Router()
const session = require("../util/session")

router.use(session)

router.post("/api/sessions", (req, res, next) => {
    if (req.session) return res.redirect("/api/sessions/exists")

    req.session.save()
    res.status(201).json({ message: "Session created." })
})

router.get("/api/sessions/exists", (req, res, next) => {
    res.status(304).json({ message: "Session exists" })
})

module.exports = router