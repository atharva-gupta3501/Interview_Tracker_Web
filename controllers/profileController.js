// const keys = require('../keys.js');

const User = require('../models/User');
var fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');
const viewProfile = (req, res) => {
    res.render('profile', {title: 'My Profile'});
}

// TODO conditional update /
// right now we have to fill everythinf in update form for it to work

const editProfile = (req, res, next) => {

        // console.log(req);
        var obj = {
            fname : req.body.fname,
            branch: req.body.branch,
            yog: req.body.yog,
            img: {
                data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }

        const token = req.cookies.jwt;
        jwt.verify(token, process.env.secret, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                // res.locals.user = null;
                next();
            } else {
                // let user = await User.findById(decodedToken.id);
                // res.locals.user = user;
                User.findByIdAndUpdate(decodedToken.id, obj,
                    function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            // console.log("Updated User : ", docs);
                            res.locals.user = docs;
                            res.redirect('/profile');
                        }
                    });
            }
        })
}

module.exports = {
    viewProfile,
    editProfile
}