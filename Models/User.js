const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email should be unique'],
        lowercase: true,
        validate: [isEmail, 'please Enter a valid Email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, 'password min length is 6 chars']
    }
});

userSchema.statics.loginUser = async function(email, password) {



    const user = await this.findOne({ email });

    if (user) {

        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }

        throw new Error("Password is not correct!");
    }


    throw new Error("Email is not password!");
}


userSchema.pre("save", async function(next) {
    const user = this;
    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, salt);

    next();
})

const User = mongoose.model("user", userSchema);

module.exports = User;