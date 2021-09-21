require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 5;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected the database");
}).catch((err) => {
    console.log(err);
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}) 

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {
    try {
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const newUser = new User({
                email: req.body.username, 
                password: hash
            })
            await newUser.save();
            res.render("secrets");
        });
    } catch(err) {
        console.log(err);
    }
})

app.post("/login", async (req, res) => {
    try {
        const userName = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({email: userName});
        bcrypt.compare(password, foundUser.password, async (err, result) => {
            if(result == true) {
                res.render("secrets");
            }
        });
    } catch(err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log("connection successful");
})