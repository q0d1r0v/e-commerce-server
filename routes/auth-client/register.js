const express = require('express')
const database = require('../../database/database')

const router = express()

router.post('/register', (req, res) => {
    const { username, password } = req.body
    const access_token = req.headers.authorization
    console.log(username, password)
})

module.exports = router