const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const requireAuth = (req, res, next) => {

    const token = req.body.jwt;

    if (token) {
        jwt.verify(token, 'jwtCourse', (error, decodedToken) => {

            if (error) {
                console.log(error);
                res.redirect("/login");

            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect("/login");
    }

};

const checkUser = (req, res, next) => {

    const token = req.body.jwt;

    if (token) {
        jwt.verify(token, 'jwtCourse', async(error, decodedToken) => {
            if (error) {
                console.log("There is an Error" + error);
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };