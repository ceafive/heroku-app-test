let mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	user: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);