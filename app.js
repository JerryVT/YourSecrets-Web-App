//jshint esversion:6
require('dotenv').config();	//no need to define const
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


const userSchema = new mongoose.Schema ({  //creates user Schema
	email: String,
	password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); //encryptedFields only encrypt particular fields. If not specified, it will encrypt the entire document

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});

	console.log(req.body.username);

	newUser.save(function(err){
		if(err) {
			console.log(err);
		} else {
			res.render("secrets");
		}
	})

});

app.post("/login", function(req, res){
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({email: username}, function(err, foundUser){
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				if (foundUser.password === password) {
					res.render("secrets");
				}
			}
		}
	});
});







///////////////////////////////Setting Up Port///////////////////////////////

app.listen(process.env.PORT || 3000, function(){
	console.log("Server has started running on port : 3000");
})