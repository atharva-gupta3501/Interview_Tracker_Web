// const keys = require('../keys.js');

const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('blogs', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

const get_user_blogs = (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = jwt.decode(token);
  Blog.find({author : decodedToken.id}).sort({ createdAt: -1 })
    .then(result => {
      res.render('blogs', { blogs: result, title: 'My blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .populate('author')
  .exec((err,blog) => {
    if(err){
      console.log(err);
      res.render('404', { title: 'Blog not found' });
    } else {
      res.render('details', { blog: blog, title: 'Blog Details' });
    }
  })
}

const blog_create_get = (req, res) => {
  res.render('blogCreate', { title: 'Create a new blog' });
}

const blog_create_post = async (req, res) => {
  const { title, snippet, body } = req.body;
  const token = req.cookies.jwt;
  let decodedToken = jwt.decode(token);
  const userID = decodedToken.id;
  const blog = new Blog({
    title: title,
    snippet: snippet,
    body: body,
    author: userID,
  });

  blog.save()
    .then(result => {
      res.redirect('./blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  const token = req.cookies.jwt;
  if (token) {

    ////////////////////////////////////////////
    // This method is not safe//////////////////
    // let decodedToken = jwt.decode(token);
    // Blog.findById(id)
    //   .then(result => {
    //     if (result.userID === decodedToken.id) {
    //       Blog.findByIdAndDelete(id)
    //         .then(result => {
    //           res.json({ redirect: '/blogs' });
    //         })
    //         .catch(err => {
    //           console.log(err);
    //         });
    //     } else {
    //       res.json({ error: 'Not authorised to delete' });
    //     }
    //   });
    /////////////////////////////////////////////////////////

    jwt.verify(token, process.env.secret, (err, decodedToken) => {
      if (err) {
        res.json({ error: 'User Not verified' });
      } else {
        Blog.findById(id)
      .then(result => {
        if(result){
          if (result.author.equals(decodedToken.id)) {
            Blog.findByIdAndDelete(id)
              .then(result => {
                res.json({ redirect: '/blogs' });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            res.json({ error: 'Not authorised to delete' });
          }
        }
      });
      }
    });
  } else {
    res.json({ error: 'Not authorised to delete' });
  }
}

module.exports =
{
  get_user_blogs,
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete
}