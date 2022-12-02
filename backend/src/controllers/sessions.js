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

    // Fixes week offset where choosing a Sunday would return the following week
    if (date.getDay() === 0) {
        mon -= 7
    }

    let sun = mon + 6

    // Fixes month offset where if the latter part of a week is in a new month
    // the end date would be set in the current month
    // Logic from https://www.geeksforgeeks.org/how-to-get-the-number-of-days-in-a-specified-month-using-javascript/#:~:text=JavaScript%20getDate()%20Method%3A%20This,31)%20for%20the%20defined%20date.&text=Return%20value%3A%20It%20returns%20a,the%20day%20of%20the%20month.
    if (mon < 1) {
        sun += new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    }

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

    if (!req.body || !req.body.date) return res.status(400).json({ message: "Bad request, date required." })

    let date = new Date(req.body.date)
    // Catches invalid dates
    if (date.toString() === "Invalid Date") return res.status(400).json({ message: "Bad request, invalid date." })

    req.session.interval = getWeek(date)
    res.status(200).json(req.session)
})

module.exports = router