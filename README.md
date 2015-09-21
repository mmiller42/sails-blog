# sails-blog
A blog system written on the Sails.js framework, using MongoDB for document storage.

## Introduction
This is a demonstrative example of a web application built using the Sails.js framework with MongoDB. Public-facing views are rendered via EJS templates on the server. The administration UI is powered by Angular.js.

## Setup
1. If using Sails.js for the first time, be sure to `npm install -g sails`.
1. Clone/fork the Git repository to your machine.
1. Run `npm install` inside the directory.
1. Create a MongoDB database for your blog (e.g. `sails-blog`).
1. Create a file called `local.js` in the `config/` directory:

	'use strict';
	module.exports = {
		connections: {
		'sails-blog': {
			adapter: 'sails-mongo',
			host: 'localhost', // Host if remote connection
			port: 27017, // Port if not default
			// Uncomment these and add values if you need to authenticate to MongoDB
			// user: '',
			// password: '',
			database: 'sails-blog' // The name of your database
		}
	};

1. You will need to create an initial author. Run `sails console`.
1. Enter `Author.create({ email: 'your@email.com', password: 'yourPassword', displayName: 'Your Name' }).exec(sails.log);` (with your information)
1. Observe the ID of the newly created author.
1. Open `config/sailsBlog.js` and set the value of `adminAuthorId` to be the ID of your newly created author to give yourself administrative access.
1. Edit any other values in `sailsBlog.js` as you see fit.


## Running
Run the blog at any time with `sails console` for a REPL or `sails lift` for just output. Make sure `mongod` is running. Press `Ctrl + C` to stop.

## Configuration
### HTML Templates
Templates for the frontend views are rendered with EJS. They are in the `views/` directory. Subdirectories include `layouts/`, which contains full-document templates, and `components/`, which are reusable template partials. All views are wrapped in the `frontend.ejs` layout. View assets (JavaScript, CSS, images, etc.) are contained in the `assets/` directory.

### Data Passed To Templates
Each of the static public-facing views are rendered by the `ViewsController`, which renders the EJS template and passes the relevant data into it. To add or manipulate the data passed into a view, edit `api/controllers/ViewsController.js`.

### Creating Views
Additional frontend views can be created by adding additional methods to the `ViewsController`, creating a view file in `views/`, and adding another route to the `ViewController` method routes in `config/routes.js`.