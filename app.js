//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
    secret:'Our little secret.',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/userDB',{ useUnifiedTopology: true, useNewUrlParser: true , useFindAndModify: false });
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',function(req,res){
    res.render('home.ejs');
    
});

app.get('/login',function(req,res){
    res.render('login.ejs');
});

app.get('/register',function(req,res){
    res.render('register.ejs');
});

app.post('/register', function(req,res){
   
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
            
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render('secrets');
            }
        });
    });
   
    
})

app.post('/login', function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                   if(result===true){
                       res.render('secrets');
                   }
                });
                    
                
            }
        }
    })
})


app.listen(3000,function(res,req){
    console.log('Server Started')
})
