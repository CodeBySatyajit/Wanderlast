const User = require("../models/user.js");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// Signup logic
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password, passwordConfirm } = req.body;

        // Check if passwords match
        if (password !== passwordConfirm) { 
            req.flash("error", "Passwords do not match");
            return res.redirect("/signup");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash("error", "Username or email already exists");
            return res.redirect("/signup");
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Log user in after signup
        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };

        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// Render login form
module.exports.loginFormRender = (req, res) => {
    res.render("users/login.ejs");
}

// Login logic
module.exports.loginLogic = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }

        // Create session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        req.flash("success", "Welcome back!");
        res.redirect(req.session.returnTo || "/listings");
        delete req.session.returnTo;
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/login");
    }
}

module.exports.logout = (req, res) => {
    req.session.user = null;
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
}