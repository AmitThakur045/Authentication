require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

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
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        await newUser.save();
        res.render("secrets");
    } catch(err) {
        console.log(err);
    }
})

app.post("/login", async (req, res) => {
    try {
        const userName = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({email: userName})
        if(foundUser.password === password) {
            res.render("secrets");
        }
        
    } catch(err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log("connection successful");
})