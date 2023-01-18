const express = require('express');
const { ObjectId } = require('mongodb');

const HttpError = require('../models/http-error');

const User = require('../models/user');


const router = express.Router();

router.get('/', function (req, res) {
    res.render('Qc-Home');
});
router.get('/api/users/login', function (req, res) {
    res.render('login');
});
router.get('/api/users/signup', function (req, res) {
    res.render('signup');
});


router.get('/dashbord', async function (req, res, next) {
    let userId = req.params.id;

    let existingUser;

    try {
        existingUser = await User.findOne({ _id: new ObjectId(userId) },
            { name: 1 })
    } catch (e) {
        const error = new HttpError(
            'Login failed, please try again later',
            500
        );
        return next(error);
    }

    res.render('dashbord');
});
module.exports = router;
