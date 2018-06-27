# Logbook Mo

## My goals

* I want to get better at setting up tooling
* I want to write better CSS
* I want to optimise performance
* I want to do back-end operations

## The process

This project was a very challenging one for me personally. I don't really doubt my technical skills but it was a bit difficult to work in a team where not everyone was on the same level.

In my idea I could have done a better job of taking this into consideration. This project has had me do a lot of small things.

### Tooling

For this project we decided on setting up a tooling setup so that we could all work with the same basis and have enforced SCSS and JS rules.

These were the requirements setup by our team;

* SCSS to CSS
* ES8 to ES5 ( Javascript )
* SCSS style linter that enforces a style
* JS style linter that enforces a style
* Copying of static files to the /public folder

Which resulted in this tech stack;

* Browserify
* Babelify
* Watchify
* Node-sass
* Post-CSS
* cpx
* onchange
* ESlint
* Stylelint
* Seng wizard

This process started from [this commit](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/a417a0a7e1b5b712864d526697b48a36a7c7c889) until [this one.](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/4eca4fe0be6aa5fde2f25c92d9dd0c37220d9d49)

### Optimising Performance

I wanted to make sure our project had a very good performance score so that it could rival any competitors.

I wrote a weekly nerd article on this based on this project, [which can be found here.](https://github.com/moniac/weekly-nerd/blob/master/OPTIMISING-PERFORMANCE.md)

The commit for this [can be found here.](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/7ad81fd5adead494fd811d3f3bef0185e877e208)

### Back-End operations

I really enjoy working on the back-end, especially with node.js. It probably helps that I love Javascript.

#### Adding a login functionality

For this project, we needed a login functionality specifically for admins. Since this is a powerful role, we had to make sure there were multiple checks to verify if the logging in user had the right role.

This is the login form for an admin;

```html
<form method="POST" action="/admin/login">
	<label> Email:
			<input type="email" name="email" autofocus required >
	</label>
	<label> Password:
			<input type="password" name="password" pattern=".{7,}" title="minimum 7 characters" required>
	</label>
	<input type="submit" value="Login">
</form>
```

And this is the back-end code;

```js
router.post( '/login', ( req, res ) => {

	const {
		email,
		password
	} = req.body

	
	pool.query( 'SELECT * FROM users WHERE email = ?', email )
		.then( record => {
			if ( !record[0] ) {
				res.redirect( '/admin' )
				return
			}
			bcrypt.compare( password, record[0].password, ( err, result ) => {
				if ( err ) {
					throw err
				}

				if ( result ) {
					req.session.role = 1
					req.session.save()
				}
			} )
		} ).then(() => {
			res.redirect( '/admin' )
		}).catch(err => console.log(err))

} )

```
As you can see, we have multiple fail safes in case something goes wrong or if someone tries to login but isn't an admin.
```js

router.get( '/', async ( req, res ) => {

	if ( !req.session.role || req.session.role !== 1 ) {

		res.render( 'adminLogin' )

	} else if ( req.session.role && req.session.role === 1 ) {

		try {
			const reportedStories = await getReportedStories()

			res.render( 'adminPanel', {
				reportedStories
			} )

		} catch ( err ) {

			console.error( err )

		}
		
	}

} )
```

[This commit can be found here.](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/c687644eb432178b3a3b10084d7b1fa86b7d24d8)

## In Conclusion

At the end of this minor, I can see that I've made a lot of leaps in terms of knowledge and technical skills. I've had many frustrations and difficult moments along the road, but I take pride in that they all are part of me and of where I am now.

I'm happy that I could prove myself to myself and that I could help out my teammates where needed. It was tiring at times to keep an overview of everything or to have to explain choices/code to others, but I am confident that they are things I have to know on my road to become a proper professional.