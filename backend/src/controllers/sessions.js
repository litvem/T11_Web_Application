const express = require("express")
const router = express.Router()
const session = require("../util/session")

router.use(session)

router.post("/api/sessions", (req, res, next) => {
    if (req.session.user) return res.status(200).json(req.session)

    req.session.user = req.session.id
    res.status(201).json(req.session)
})

module.exports = router