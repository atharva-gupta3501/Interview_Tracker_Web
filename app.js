// const keys = require('./keys.js');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');   // not used yet
// var bodyParser = require('body-parser');

const Company = require('./models/company');
const Exp = require('./models/experience');
const ProgrammingList = require('./models/programming');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const programmingRoutes = require('./routes/programmingRoutes');
const companyRoutes = require('./routes/companyRoutes');
const expRoutes = require('./routes/expRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const dbURI = 'mongodb+srv://'+ process.env.dbUserName+':'+process.env.dbPassword +'@cluster0.l9mcp.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));
// middleware
app.use('/admin', adminRoutes);
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// this is so that request can access url encoded values
// int create blog process, the form uses "POST" method
// that sends response to the server attached with url
// to access that this middleware is used
app.use(express.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');

// database connection


// routes
app.get('*', checkUser);
app.get('/', async (req, res) => {

  const companylist = await Company.find();
  const categories = await ProgrammingList.find();
  Exp.find()
    .populate('user')
    .populate('company')
    .exec((err, exps) => {
      if (err) {
        console.log(err);
      }
      else {
        res.render('home', { title: 'home', companylist: companylist, exps: exps, list: categories  });
      }
    })
});

/////////////////////////////////////////////////
const User = require('./models/User');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });
app.post('/', upload.single('image'), (req, res, next) => {

  // console.log(req);
  var obj = {
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
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
            res.redirect('/');
          }
        });
    }
  });



  // imgModel.create(obj, (err, item) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     // item.save();
  //     res.redirect('/');
  //   }
  // });
});
////////////////////////////////////////////////////////////

app.use(authRoutes);
app.use('/profile',profileRoutes);
app.use('/blogs', blogRoutes);
app.use('/programming', programmingRoutes);
app.use('/exp', expRoutes);
app.use('/companies', companyRoutes);

