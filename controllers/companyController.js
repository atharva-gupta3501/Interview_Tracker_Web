const Company = require('../models/company');

///////
var fs = require('fs');
var path = require('path');
////////

const all_company = async(req, res) => {
    try {
        const allCompanies = await Company.find();
        res.render('company', { title: 'All Companies', list: allCompanies });
    }
    catch (err) {
        console.log(err);
    }
}

const new_company = async (req, res) => {
    const {companytitle , companybody, companylink} = req.body;
    const img = {
        data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }

    try {
        const company = await Company.create({ title: companytitle, about: companybody, img: img, link: companylink });
        res.redirect('/companies');
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    all_company,
    new_company
}