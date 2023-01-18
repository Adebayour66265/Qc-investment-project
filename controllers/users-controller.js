const { validationResult } = require('express-validator');
require('dotenv').config();

const HttpError = require('../models/http-error');

const User = require('../models/user');

const getUsers = async (req, res, next) => {

    let users;


    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            ' Fetching users failed, please try again later .',
            401
        );
        return next(error);
    }
    res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
}


const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError(
            'Invalid input passed, check your data', 422))

    }


    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later',
            500
        );
        return next(error);
    }


    if (existingUser) {
        const error = new HttpError(
            'User is Already exist, Login Instead',
            422);

        return next(error);
    }



    const createdUser = new User({
        name,
        email,
        password,
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up user Failed!, please try again',
            500
        );
        return next(error)
    }
    console.log(createdUser);

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,

    });
}


const login = async (req, res, next) => {
    const { email, password } = req.body;


    let existingUser;

    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Loginig in failed, please try again later',
            500
        );
        return next(error);
    }


    if (!existingUser) {
        const error = new HttpError(
            ' Invalid credentials could not log you in .',
            401
        );
        return next(error);
    }



    if (password != existingUser.password) {
        const error = new HttpError(
            ' Invalid credentials could not log you in Email or Password are not equal.',
            401
        );
        return next(error);
    }





    // res.status(200).json({
    //     userId: existingUser.id,
    //     email: existingUser.email,
    //     "message": "You are login to an admin dashbord"
    // });

    res.redirect('/dashbord');

}

const logout = (req, res) => {
    try {
        return res.status(200).redirect('/');
    } catch (e) {
        return res.status(500).send(e)
    }
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.logout = logout