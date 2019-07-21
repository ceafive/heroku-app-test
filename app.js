let express = require("express"),
	session = require("express-session"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	dotenv = require('dotenv');
	// crypto = require("crypto"),
	// nodemailer = require("nodemailer"),
	// async = require("async");
	app = express();

dotenv.config();
var URL = process.env.MONGODB_URL;
console.log(URL);


// CONNECT APP TO MONGODB DB
mongoose.connect(URL, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR:", err.message);
});

// REQUIRE CAMPGROUND SCHEMA
let Campground = require("./models/campgroundschema");

//REQUIRE USER SCHEMA
let User = require("./models/user");

//REQUIRE ROUTES
let campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/authentication");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
app.use(session({
	secret: "Castro second auth",
	resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(authRoutes);

// PORT LISTEN
app.listen(3000, function(){
	console.log("hey, i am listening");
});