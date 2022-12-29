# T11 - Web Application Backend

## Responsibilities

The **Express.js Backend** for the web application is responsible for handling sessions
for the [Frontend](../frontend/README.md).

### Details

The Backend has the following responsibilities:

- create a **session ID** and date interval upon loading the web page,
- maintain the same **session ID** throughout the booking process and on page reload for each client,
- store the selected date interval in each session, and
- allow clients to update their date interval.

### Endpoints

These endpoints are provided by the Backend, more information can be found in the
[wiki page](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-web-application/-/wikis/Express-Backend#api-endpoints).

#### `POST /api/sessions`

Used to create new session or get an existing one.

#### `PATCH /api/sessions`

Used to patch the date interval used to filter booking slots.

## Development Tools

> Node.js <br> [Download here](https://nodejs.org/en/)

> Express.js <br> [Download here](https://expressjs.com/)


## Getting started with Backend

### After cloning the repo, open the terminal in your local machine and do the following:

| Description                                                                                                                                       | Command                                  |
|---------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| Change directory to the **backend** folder                                                                                                        | `cd backend`                             |
| Install dependencies                                                                                                                              | `npm install`                            |
| Add `SESSION_SECRET` env to a .env file<br/>Angled brackets ("<" and ">"), pipes ("&#124;"), and carets ("^") must be escaped with a caret ("^"). | `echo SESSION_SECRET=(insert key)> .env` |
| Run the **backend**                                                                                                                               | `npm run start`                          |
