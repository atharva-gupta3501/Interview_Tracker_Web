// const keys = require('../keys.js');

const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const ProgrammingList = require('../models/programming');
const Blog = require('../models/blog');
const User = require('../models/User');
const Question = require('../models/question');
const Company = require('../models/company');
const Exp = require('../models/experience');

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  resources: [ProgrammingList,Blog,User, Question,Exp,Company],
  rootPath: '/admin',
});

const ADMIN = {
    email: process.env.ADMIN_EMAIL || process.env.adminEmail,
    password: process.env.ADMIN_PASSWORD || process.env.adminPassword,
}
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: 'admin-bro',
    cookiePassword: process.env.adminBrowserPassword ,
    authenticate: async(email, password) =>{
        if(email === ADMIN.email && password === ADMIN.password){
            return ADMIN;
        }
        return null;
    }
});

module.exports = router;