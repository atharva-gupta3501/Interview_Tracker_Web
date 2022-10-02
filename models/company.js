const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    link: {
        type: String,
    },
    img: {
        data: Buffer,
        contentType: String
    },
    about:{
        type: String,
    }
})

const Company = mongoose.model('Company', companySchema);
module.exports = Company;