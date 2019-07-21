let express = require("express"),
	router  = express.Router(),
	Campground = require("../models/campgroundschema");

// SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
	if(err){
		console.log(err);
	}else{
		res.render("campgrounds", {campgrounds: campgrounds});
	}
});
});

// NEW CAMPGROUND FORM
router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("new");
});

// CREATE NEW CAMPGROUND 
router.post("/campgrounds", isLoggedIn, function(req, res){
	req.body.campground.name = req.sanitize(req.body.campground.name);
	req.body.campground.image = req.sanitize(req.body.campground.image);
	req.body.campground.description = req.sanitize(req.body.campground.description);
	req.body.campground.user = {
				id: req.user.id,
				username: req.user.username
	};
	Campground.create(req.body.campground, function(err, campground){
	if(err){
		console.log(err);
	}else {
		res.redirect("back");
	}
});
});

// DISPLAY CAMPGROUND INFO
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
            console.log(err);
            req.flash("error", "Campground Does Not Exist");
            return res.redirect('/campgrounds');
		}else {
				res.render("info", {campground: campground});
		}
	});
});

//EDIT CAMPGROUND INFO
router.get("/campgrounds/:id/edit", checkAuthorization, function(req, res){
			Campground.findById(req.params.id, function(err, campground){
				res.render("edit", {campground: campground});
});
});

// UPDATE CAMPGROUND INFO 
router.put("/campgrounds/:id", checkAuthorization, function(req, res){
		req.body.campground.name = req.sanitize(req.body.campground.name);
		req.body.campground.description = req.sanitize(req.body.campground.description);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
	if(err){
		console.log(err);
	}else {
		res.redirect("/campgrounds/" + campground._id);
	}
});
});

// DELETE A CAMPGROUND
router.delete("/campgrounds/:id", checkAuthorization, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else {
				res.redirect("/campgrounds");
		}
	});
});

//AUTHENTICATE USER
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
		req.flash("error", "Please Login First");
		res.redirect("/login");
}

//CHECK AUTHORIZATION
function checkAuthorization(req, res, next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
			req.flash("error", "Campground Not Found");
			res.redirect("back");
		}else{
			if(campground.user.id.equals(req.user._id) || req.user && req.user.isAdmin){
				next();
			}else{
				req.flash("error", "Unauthorized Request");
				res.redirect("back");
			}
			
		}
	});
	}else{
		req.flash("error", "Please Login First");
		res.redirect("/login");
	}
}
module.exports = router;
