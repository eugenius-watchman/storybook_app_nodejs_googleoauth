// using express router
const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')


/**
 * @desc Login/Landing page
 * @ route GET /
 * ensureGuest since a guest can see the login page
 */
router.get('/', ensureGuest, (req, res) => {
    // send response to client
    res.render('login', {
        layout: 'login',
    })
})


/**
 * @desc Dashboard
 * @ route GET /dashboard
 */
router.get('/dashboard', ensureAuth, (req, res) => {  
    // send response to client
    res.render('dashboard', {
        name: req.user.firstName,
    })
})


module.exports = router