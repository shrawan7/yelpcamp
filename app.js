require('dotenv').config()

const express = require('express'),
	  bp = require('body-parser'),
	  mongoose = require("mongoose"),
	  flash = require('connect-flash'),
	  expressSanitizer = require("express-sanitizer"),
	  methodOverride = require("method-override"),
	  Campground = require('./models/campground'),
	  Comment    = require('./models/comment'),
	  User       = require('./models/user'),
	  seedDB = require('./seeds'),
	  passport = require('passport'),
	  localStrategy = require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  app = express();

const commentRoutes = require('./routes/comment'), 
	  campgroundRoutes = require('./routes/campground'),
	  indexRoutes      = require('./routes/index');

mongoose.connect(process.env.MONGODB_URI , {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(bp.urlencoded({extended: true}));
app.use(expressSanitizer());
// seedDB();
app.use(flash());

app.locals.moment = require('moment');


app.use(require("express-session")({
	secret: "She is my girl friend",
	resave: false,
	saveUninitialized: false  
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
	res.locals.user = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(campgroundRoutes);


const port = process.env.PORT || 8080;
const ip = process.env.IP || "0.0.0.0";

app.listen(port, ip, ()=>{
	console.log(`Server running at http://${ip}:${port}`);
});