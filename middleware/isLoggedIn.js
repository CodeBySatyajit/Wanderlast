
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

module.exports = isLoggedIn;