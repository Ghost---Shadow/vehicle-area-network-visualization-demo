// app/routes.js

var Checkpoint = require('../app/models/checkpoint');
var Logic = require('../app/simulation/logic');

console.log(Logic.pipe);

module.exports = function (app, passport) {

	app.get('/', function (req, res) {
		res.render('index.ejs');
	});

	app.get('/simulation', isLoggedIn, function (req, res) {
		res.render('simulation.ejs', {
			email: "dum"//req.user.local.email
		});
	});

	app.get('/login', function (req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.post('/save', isLoggedIn, function (req, res) {
		var obj = req.body;
		console.log(obj);
		var query = { 'name': obj.name };
		Checkpoint.findOneAndUpdate(query, obj, { upsert: true }, function (err, doc) {
			if (err) {
				console.log(err);
				return res.send(500, { error: err });
			}
			return res.send(200);
		});
	});

	app.post('/load', isLoggedIn, function (req, res) {
		Checkpoint.findOne({ 'name': req.body.name }, function (err, check) {
			if (err) return handleError(err);
			//console.log(check);
			res.send(check);
		});
	});

	app.post('/update', function (req, res) {
		//console.log(req.body);
		[positions,G,R,packets] = Logic.pipe(req.body);		
		var obj = {
			'positions':positions,
			'G':G,
			'R':R,
			'packets':packets
		};
		//console.log(obj);
		res.send(obj);
	});

	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	return next();
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
