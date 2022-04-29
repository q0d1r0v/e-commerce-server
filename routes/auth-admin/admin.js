const express = require("express")
const jwt = require('jsonwebtoken');
let token = require('crypto').randomBytes(20).toString('hex')
require('dotenv').config()

const admin_username = "kadirov"
const admin_password = "4929"
const admin_client_secret = process.env.CLIENT_SECRET

const router = express()


router.post("/login/", (req, res) => {
    let { client_secret, username, password } = req.body

    if (admin_username === username && admin_password === password && admin_client_secret === client_secret) {
        res.send(200, {
            message: "you are logined",
            token: {
                access_token: token
            }
        })
    } else {
        res.send(401, {
            message: "incorrect username or password"
        })
    }
})

module.exports = router