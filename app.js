//jshint esversion:6
require('dotenv').config()
const md5 = require('md5');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB',{ useUnifiedTopology: true, useNewUrlParser: true , useFindAndModify: false });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model('User', userSchema);

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
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
    });
})

app.post('/login', function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secrets');
                }
            }
        }
    })
})


app.listen(3000,function(res,req){
    console.log('Server Started')
})
