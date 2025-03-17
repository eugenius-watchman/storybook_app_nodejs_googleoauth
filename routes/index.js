// using express router
const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/story')

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
router.get('/dashboard', ensureAuth, async (req, res) => {  
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        // send response to client
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
    
})


module.exports = router