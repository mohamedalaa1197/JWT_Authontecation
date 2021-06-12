const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const errorHandler = (error) => {

    let err = { email: "", password: "" };

    if (error.message === 'Email is not password!') {
        err.email = 'that email is not correct'
    }

    if (error.message === 'Password is not correct!') {
        err.password = 'password is not correct'
    }
    if (error.code === 11000) {
        err.email = 'Email is already registered'
    }

    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {

            err[properties.path] = properties.message
        })
    }
    return err;
};

const tokenAge = 3 * 24 * 60 * 60;

const createTocken = (id) => {
    const tockenGenerated = jwt.sign({ id }, 'jwtCourse', {
        expiresIn: tokenAge
    });
    return tockenGenerated;
}

const signUpGet = async(req, res) => {

    res.render('signup')
}

const signUpPost = async(req, res) => {

    const { email, password } = req.body;


    try {
        const user = await User.create({ email, password });
        const token = createTocken(user._id);
        res.cookie('jwt', token, { httpOnly: false, maxAge: 1 * 1000 });
        res.status(200).json({ user: user._id });
    } catch (e) {

        const errors = errorHandler(e);
        res.status(404).send({ errors })
    }


}

const loginPost = async(req, res) => {

    const { email, password } = req.body;
    console.log(email);
    try {

        const user = await User.loginUser(email, password);
        console.log(user);
        const token = createTocken(user._id);
        res.cookie('jwt', token, { httpOnly: false, maxAge: tokenAge * 1 * 1000 });
        res.status(200).send({ user: user._id });
    } catch (e) {
        const errors = errorHandler(e);
        res.status(404).json({ errors });
    }
}

const loginget = (req, res) => {
    res.render("login")
}
const logoutGet = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect("/");
}
module.exports = {
    signUpGet,
    signUpPost,
    loginPost,
    loginget,
    logoutGet
}