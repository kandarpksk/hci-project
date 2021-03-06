var data = require('../data.json');

exports.view = function(req, res){
	data["alt"] = false;
	var user_data = JSON.parse(JSON.stringify(data));
	delete user_data.users;
	if(req.query.guest) req.session.user = "";
	if(req.query.guest != null)
		req.session.guest = req.query.guest;
	user_data.guest = req.session.guest;

	// simple authentication system
	// identical usernames go through, but passwords must be different
	//  (relying on chance since this doesn't really matter for the app)
	if(req.query.username != null && req.query.username != "")
		for(i = 0; i < data["users"].length; i++)
			if(data["users"][i]["username"] == req.query.username) {
				if(data["users"][i]["hash"] == req.query.hash)
					{ req.session.user = data["users"][i]["name"];
						req.session.guest = false; }
			} else req.session.user = ""; // overwrite logins?

	//check data req.
	
	var goto_welcome = true;
	if(req.session.user != "" && req.session.user != null)
		goto_welcome = false;
	else if(req.session.guest) // explicitly browse as guest
		goto_welcome = false;
	if(goto_welcome){
		res.render('welcome');
		return;
	}

	//redirecting to... page

	// retrieving user information
	if(req.session.user != "" && req.session.user != null) {
		if(req.session.name != "" && req.session.name != undefined && req.session.name != null)
			user_data["name"] = req.session.name; else user_data["name"] = req.session.user;
		for (i = 0; i < data["users"].length; i++)
			if (data["users"][i]["name"] == req.session.user) {
				user_data["days"] = JSON.parse(JSON.stringify(data["users"][i]["days"]));
				user_data.actual = data.users[i].actual;
			}
	}

	user_data["screenshot"] = true;
	
	if(req.session.noreminder != "" && req.session.noreminder != undefined && req.session.noreminder != null)
		user_data.noreminder = req.session.noreminder;
	user_data["page_home"] = true;
	res.render('index', user_data);
};

//deprecate
exports.viewAlt = function(req, res){
	data["alt"] = true;
	res.render('index', data);
};