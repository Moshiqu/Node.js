const router = require('express').Router()

router.get('/user/list', (req, res) => {
    res.send('Get user list')
})

router.post('/user/add', (req, res) => {
    res.send('Add user')
})

module.exports = router