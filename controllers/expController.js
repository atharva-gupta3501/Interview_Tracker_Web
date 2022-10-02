const Exp = require('../models/experience');
const Company = require('../models/company');
const jwt = require('jsonwebtoken');

const all_exp = async (req, res) => {
    const companylist = await Company.find();
    Exp.find().sort({ createdAt: -1 })
        .populate('user')
        .populate('company')
        .exec((err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('exp', { exps: result, title: 'Experiences', companylist: companylist });
            }
        })
}

const post_exp = async (req, res) => {
    const { company, experience } = req.body;
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token);
    try {
        const expe = await Exp.create({ user: decoded.id, company: company, experience: experience });
        res.status(201).json({ expe: expe._id });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    all_exp,
    post_exp
}