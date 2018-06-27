# Logbook Mo

## Introduction

This project was a product made for the 'Het Scheepvaartmuseum'. The museum has an exposition on a famous dutch ship called 'De Oranje'. This ship has had a very interesting life and has transported a lot of people during its active years.

The problem that the client wants to solve is that they need a way for people to be encouraged to share and tell their stories about the ship with the world. This way a database of stories and images can be created that can be used in multiple ways.

## The design challenge

How can we create a platform that encourages people to share and tell stories about the ship 'De oranje'?

## My goals

* I want to get better at setting up tooling
* I want to write better CSS
* I want to optimise performance
* I want to do back-end operations

## The process

This project was a very challenging one for me personally. I don't really doubt my technical skills but it was a bit difficult to work in a team where not everyone was on the same level.

In my idea I could have done a better job of taking this into consideration. This project has had me do a lot of small things.

## The matching subjects

* Performance Matters
* Real-time web
* Browser Technologies

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

It was a very large task and quite a challenge, but I felt pretty confident about it. I cranked out a fully working tooling setup in about 2/3 days. I understood that the team was waiting on me so the pressure was there.

The biggest takeaway of creating this revealed itself to me in a conversation with a teacher of mine, Joost.

Joost told me that while my tooling is quite good, I didn't carefully consider the impact this could have on our team and our client. Was the team ready for this? Is the client able to run this afterwards should they want to keep the project alive?

More about this can be read [in my weekly nerd article over here.](https://github.com/moniac/weekly-nerd/blob/master/IMPACT-OF-TOOLING.md)

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

## Summary

So, to keep this document friendly for the people that will judge my work, I've put the subjects and the relevance of my work together here;

### Performance Matters

[On this branch, I optimised the website for performance.](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/109)

The website took an average of 2.7 seconds to load initially, and has by now been reduced to a second or 900 ms at the time of writing.

Again, I wrote a weekly nerd article on this based on this project, [which can be found here.](https://github.com/moniac/weekly-nerd/blob/master/OPTIMISING-PERFORMANCE.md)

---

### Real-Time Web

At Real-Time Web we used an API to get data and used templating to have the server send HTML to the client.

For this project, I was reponsible for setting up reactions from the backend to the frontend.

The relevant branches can be found [here](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/97) and [here.](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/97)

Here is a code snippet:

```js
router.post( '/:storyID/comment', ( req, res ) => {
	const commentMeta = {
		storyID: req.params.storyID,
		text: req.body.reaction,
		timestamp: moment().toISOString(),
		name: req.body.name ? req.body.name : 'Anoniem'
	}
	pool.query( 'INSERT INTO reactions SET ?', commentMeta )
		.then( () => {

			// Only redirect when query is done
			res.redirect( `/detail/${req.params.storyID}/#reactions-anchor` )

		} )
		.catch( err => console.error( err ) )
} )
```

What this code does is look at the relevant ```:storyID``` and looks at the data being sent to the path.

We then run a query to insert the comment into reactions using this query
```
'INSERT INTO reactions SET ?', commentMeta
```

And thus, comment is inserted in the backend. I was also responsible for making the comments show on the appropriate pages and having users be able to respond to other users.

---

## Browser Technologies

I think the most important thing here is that I wrote the compiler code that allows us to write modern code and have it get compiled down to ES5, which is old browser friendly.

### Index.js

In the main index.js file, we run a simple if statement to check if the browser supports some very basic functionalities.

```js
( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return
	someFunction()
} )()
```

### EnhancedDetail.js

My teammate Jamie was responsible for writing the code for the intersection observer, and together we worked on making sure it wouldn't crash on older browsers.

I wrote a function that checks if the browser supports the Intersection Observer, and if it doesn't it will use another function;

```js
function enhancedDetailInit() {
	if ( ! ( document.querySelector( '.detail__content' ) && document.querySelector( '.detail__content--container' ) ) ) return
	if ( 'IntersectionObserver' in window ) {
		enhancedDetail()
	} else {
		fallbackDetail()
	}
}
```

## In Conclusion

At the end of this minor, I can see that I've made a lot of leaps in terms of knowledge and technical skills. I've had many frustrations and difficult moments along the road, but I take pride in that they all are part of me and of where I am now.

I'm happy that I could prove myself to myself and that I could help out my teammates where needed. It was tiring at times to keep an overview of everything or to have to explain choices/code to others, but I am confident that they are things I have to know on my road to become a proper professional.