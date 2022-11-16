const express = require("express")
const router = express.Router()
const session = require("../util/session")

/**
 * Gets Monday and Sunday of the week of the specified date in the format "yyyy-mm-dd"
 * @param date the date to get the week from
 * @returns {{from: string, to: string}} the week interval
 */
const getWeek = date => {
    // Implementation taken from https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
    // Date is date of month and day is day of week. Week starts on Sunday -> +1 to adjust to Monday
    let mon = date.getDate() - date.getDay() + 1
    let sun = mon + 6

    return {
        // Formatted "yyyy-mm-ddThh:mm:ss.sssZ". Splitting by "T" -> [ "yyyy-mm-dd", "hh:mm:ss.sssZ" ]
        from: new Date(date.setDate(mon)).toISOString().split("T")[0],
        to: new Date(date.setDate(sun)).toISOString().split("T")[0]
    }
}

router.use(session)

router.post("/api/sessions", (req, res, next) => {
    if (req.session.user) return res.status(200).json(req.session)

    req.session.user = req.session.id
    req.session.interval = getWeek(new Date())
    res.status(201).json(req.session)
})

router.patch("/api/sessions", (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ message: "Unauthorized, no session." })
    console.log(req.body)

    if (!req.body || !req.body.date) return res.status(400).json({ message: "Bad request, date required." })

    let date = new Date(req.body.date)
    // Catches invalid dates
    if (date.toString() === "Invalid Date") return res.status(400).json({ message: "Bad request, invalid date." })

    req.session.interval = getWeek(date)
    res.status(200).json(req.session)
})

module.exports = router